import numpy as np
from typing import List, Dict, Any, Optional
from scipy.stats import ks_2samp
from loguru import logger

class DriftDetector:
    """
    Advanced drift detection for AI models.
    Supports distribution shift detection for numeric features 
    and embedding-based semantic drift.
    """
    
    @staticmethod
    def calculate_psi(expected: np.ndarray, actual: np.ndarray, buckets: int = 10) -> float:
        """
        Calculate Population Stability Index (PSI) to detect distribution shift.
        PSI < 0.1: No significant change
        PSI < 0.25: Moderate change
        PSI >= 0.25: Significant change
        """
        def sub_psi(e_perc, a_perc):
            if a_perc == 0: a_perc = 0.0001
            if e_perc == 0: e_perc = 0.0001
            return (e_perc - a_perc) * np.log(e_perc / a_perc)

        breakpoints = np.histogram(expected, buckets)[1]
        expected_percents = np.histogram(expected, breakpoints)[0] / len(expected)
        actual_percents = np.histogram(actual, breakpoints)[0] / len(actual)

        psi_val = sum(sub_psi(expected_percents[i], actual_percents[i]) for i in range(buckets))
        return psi_val

    @staticmethod
    def detect_embedding_drift(reference_embeddings: List[np.ndarray], current_embeddings: List[np.ndarray]) -> float:
        """
        Detect semantic drift using cosine similarity shift between centroids
        or average pairwise distance.
        """
        if not reference_embeddings or not current_embeddings:
            return 0.0
            
        ref_centroid = np.mean(reference_embeddings, axis=0)
        curr_centroid = np.mean(current_embeddings, axis=0)
        
        # Calculate cosine similarity between centroids
        similarity = np.dot(ref_centroid, curr_centroid) / (np.linalg.norm(ref_centroid) * np.linalg.norm(curr_centroid))
        drift_score = 1.0 - similarity
        
        return float(drift_score)

    @staticmethod
    def detect_feature_drift(reference_data: List[float], current_data: List[float]) -> Dict[str, Any]:
        """
        Determine if a numeric feature has drifted using Kolmogorov-Smirnov test.
        """
        if len(reference_data) < 20 or len(current_data) < 20:
            return {"drift_detected": False, "reason": "Insufficient data"}
            
        statistic, p_value = ks_2samp(reference_data, current_data)
        drift_detected = p_value < 0.05
        
        return {
            "drift_detected": drift_detected,
            "p_value": float(p_value),
            "ks_statistic": float(statistic),
            "method": "Kolmogorov-Smirnov"
        }
