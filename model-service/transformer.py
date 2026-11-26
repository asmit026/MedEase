import torch
import torch.nn as nn

class SymptomTransformer(nn.Module):
    """
    PyTorch Transformer model for clinical symptom triage.
    Encodes an input sequence of symptom indices and predicts condition probabilities across 555 SNOMED-coded conditions.
    """
    def __init__(
        self,
        num_symptoms: int = 2559,
        num_conditions: int = 555,
        max_length: int = 32,
        embedding_dim: int = 64,
        num_heads: int = 4,
        num_layers: int = 2,
        dropout: float = 0.2,
        pad_idx: int = 2559
    ):
        super().__init__()
        self.num_symptoms = num_symptoms
        self.num_conditions = num_conditions
        self.max_length = max_length
        self.embedding_dim = embedding_dim
        self.pad_idx = pad_idx

        self.embedding = nn.Embedding(num_symptoms + 1, embedding_dim, padding_idx=pad_idx)
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=embedding_dim,
            nhead=num_heads,
            dim_feedforward=128,
            dropout=dropout,
            batch_first=True
        )
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=num_layers)
        self.classifier = nn.Sequential(
            nn.Linear(embedding_dim, 128),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(128, num_conditions)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        padding_mask = (x == self.pad_idx)
        embeds = self.embedding(x)
        encoded = self.transformer(embeds, src_key_padding_mask=padding_mask)
        non_pad_mask = (~padding_mask).unsqueeze(-1).float()
        token_counts = non_pad_mask.sum(dim=1).clamp(min=1.0)
        pooled = (encoded * non_pad_mask).sum(dim=1) / token_counts
        return self.classifier(pooled)
