from typing import List, Dict, Any, Optional
from uuid import UUID
from collections import defaultdict

class AgentGraphService:
    """
    Reconstructs complex multi-agent interactions into a directed acyclic graph.
    Helps visualize how Managers and Workers pass tasks to each other.
    """
    
    def reconstruct_graph(self, spans: List[Dict[str, Any]]) -> Dict[str, Any]:
        nodes = []
        edges = []
        
        # 1. Identify active agents from span attributes
        for span in spans:
            agent_name = span.get("attributes", {}).get("agent_name", span.get("name", "Unknown Agent"))
            nodes.append({
                "id": str(span["id"]),
                "label": agent_name,
                "type": span.get("span_type", "task"),
                "status": span.get("status", "completed"),
                "latency": span.get("latency_ms", 0)
            })
            
            # 2. Link parent to child (Agent delegation)
            if span.get("parent_id"):
                edges.append({
                    "from": str(span["parent_id"]),
                    "to": str(span["id"]),
                    "label": "delegates"
                })

        return {
            "nodes": nodes,
            "edges": edges,
            "metadata": {
                "depth": self._calculate_depth(edges),
                "total_agents": len(set(n["label"] for n in nodes))
            }
        }

    def _calculate_depth(self, edges: List[Dict[str, Any]]) -> int:
        if not edges: return 1
        adj = defaultdict(list)
        for e in edges:
            adj[e["from"]].append(e["to"])
        
        def get_max_depth(node):
            if not adj[node]: return 1
            return 1 + max(get_max_depth(child) for child in adj[node])
            
        roots = set(e["from"] for e in edges) - set(e["to"] for e in edges)
        if not roots: return 1
        return max(get_max_depth(root) for root in roots)
