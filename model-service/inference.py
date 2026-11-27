import os
import json
import torch
from typing import List, Dict, Any, Optional
from transformer import SymptomTransformer

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(os.path.dirname(BASE_DIR), "medical_ai_complete_model")

MODEL_WEIGHTS_PATH = os.path.join(MODEL_DIR, "symptom_transformer.pt")
MAPPINGS_PATH = os.path.join(MODEL_DIR, "model_mappings.json")
SPECIALITY_PATH = os.path.join(MODEL_DIR, "speciality_mapping.json")
CONDITIONS_PATH = os.path.join(MODEL_DIR, "snomed_conditions.json")

class MedicalAIModelService:
    def __init__(self):
        self.model: Optional[SymptomTransformer] = None
        self.condition_to_index: Dict[str, int] = {}
        self.index_to_condition: Dict[int, str] = {}
        self.symptom_to_index: Dict[str, int] = {}
        self.condition_to_specialities: Dict[str, List[str]] = {}
        self.snomed_names: Dict[str, str] = {}
        self.pad_idx = 2559
        self.max_length = 32
        self.is_loaded = False

    def load(self):
        """Pre-load PyTorch model and clinical mappings into memory."""
        if os.path.exists(MAPPINGS_PATH):
            with open(MAPPINGS_PATH, "r", encoding="utf-8") as f:
                mappings = json.load(f)
                self.condition_to_index = mappings.get("condition_to_index", {})
                raw_i2c = mappings.get("index_to_condition", {})
                self.index_to_condition = {int(k): v for k, v in raw_i2c.items()}
                self.symptom_to_index = mappings.get("symptom_to_index", {})

        if os.path.exists(SPECIALITY_PATH):
            with open(SPECIALITY_PATH, "r", encoding="utf-8") as f:
                spec = json.load(f)
                self.condition_to_specialities = spec.get("condition_to_specialities", {})

        if os.path.exists(CONDITIONS_PATH):
            with open(CONDITIONS_PATH, "r", encoding="utf-8") as f:
                self.snomed_names = json.load(f)

        ckpt = torch.load(MODEL_WEIGHTS_PATH, map_location="cpu")
        num_symptoms = ckpt.get("num_symptoms", 2559)
        num_conditions = ckpt.get("num_conditions", 555)
        self.max_length = ckpt.get("max_length", 32)
        self.pad_idx = ckpt.get("pad_idx", 2559)

        self.model = SymptomTransformer(
            num_symptoms=num_symptoms,
            num_conditions=num_conditions,
            max_length=self.max_length,
            embedding_dim=ckpt.get("embedding_dim", 64),
            num_heads=ckpt.get("num_heads", 4),
            num_layers=ckpt.get("num_layers", 2),
            dropout=ckpt.get("dropout", 0.2),
            pad_idx=self.pad_idx
        )

        state_dict = ckpt["model_state_dict"] if "model_state_dict" in ckpt else ckpt
        self.model.load_state_dict(state_dict, strict=True)
        self.model.eval()
        self.is_loaded = True
        print(f"PyTorch SymptomTransformer loaded ({num_conditions} SNOMED conditions).")

    def clean_condition_name(self, name: str) -> str:
        for tag in ["(disorder)", "(finding)", "(procedure)", "(situation)"]:
            name = name.replace(tag, "").strip()
        return name

    def predict(self, symptom_indices: List[int], top_k: int = 3) -> Dict[str, Any]:
        if not self.is_loaded or self.model is None:
            raise RuntimeError("Model is not loaded.")

        # Ensure we have at least one valid index
        if not symptom_indices:
            symptom_indices = [949]

        # Run each symptom index through the Transformer and aggregate probability distributions
        batch = torch.full((len(symptom_indices), self.max_length), self.pad_idx, dtype=torch.long)
        for i, idx in enumerate(symptom_indices):
            valid_idx = idx if 0 <= idx < self.pad_idx else 949
            batch[i, 0] = valid_idx

        with torch.no_grad():
            logits = self.model(batch)
            probs = torch.softmax(logits, dim=-1).mean(dim=0, keepdim=True)
            top_probs, top_indices = torch.topk(probs, k=min(top_k, 555))
            top_probs = top_probs[0].tolist()
            top_indices = top_indices[0].tolist()

        conditions = []
        icons_list = ["pulmonology", "air", "health_and_safety", "stethoscope", "healing"]

        for rank, (idx, prob) in enumerate(zip(top_indices, top_probs)):
            if rank > 0 and prob < 0.04:
                continue
            snomed_id = self.index_to_condition.get(idx, str(idx))
            raw_name = self.snomed_names.get(snomed_id, f"Clinical Condition {snomed_id}")
            condition_name = self.clean_condition_name(raw_name)

            if rank == 0:
                relevance = "High" if prob >= 0.20 else "Moderate"
            elif rank == 1:
                relevance = "Moderate"
            else:
                relevance = "Consideration"

            specialists = self.condition_to_specialities.get(snomed_id, ["General Physician"])

            conditions.append({
                "id": f"cond-{snomed_id}",
                "snomedId": snomed_id,
                "name": condition_name,
                "probability": round(prob, 4),
                "relevance": relevance,
                "badge": f"Potential relevance: {relevance}",
                "icon": icons_list[rank % len(icons_list)],
                "specialties": specialists,
                "description": f"Observed symptom pattern matches clinical presentations associated with {condition_name.lower()}. An evaluation by a medical specialist can confirm diagnostic factors."
            })

        top_specialties = conditions[0].get("specialties", ["General Physician"])
        primary_specialty = top_specialties[0] if top_specialties else "General Physician"

        specialty_descriptions = {
            "Pulmonologist": "Specialized in respiratory and bronchial health. A consultation will evaluate airway function and lung health.",
            "Cardiologist": "Specialized in heart and circulatory care. An evaluation can review cardiovascular indicators and rhythm.",
            "Gastroenterologist": "Specialized in digestive and intestinal health to evaluate gastrointestinal symptoms.",
            "Neurologist": "Specialized in nervous system, brain, and spinal conditions.",
            "Orthopedic": "Specialized in joints, bones, and musculoskeletal rehabilitation.",
            "Dermatologist": "Specialized in cutaneous, skin barrier, and allergic conditions.",
            "General Physician": "An initial evaluation by a general physician will assess your symptoms and coordinate further diagnostics if necessary."
        }

        specialty_desc = specialty_descriptions.get(
            primary_specialty,
            f"An initial evaluation with a {primary_specialty.lower()} may help determine the next appropriate diagnostic step."
        )

        return {
            "conditions": conditions,
            "recommendedSpecialty": primary_specialty,
            "specialtyDescription": specialty_desc,
            "allSpecialties": top_specialties
        }

ai_service = MedicalAIModelService()
