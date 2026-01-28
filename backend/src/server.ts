import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

type NodeStatus = "online" | "offline" | "maintenance";

interface Node {
	id: string;
	name: string;
	status: NodeStatus;
	cpuUsage: number;
	memoryUsage: number;
	timestamp: string;
}

const STATUS: NodeStatus[] = ["online", "offline", "maintenance"];

let nodes: Node[] = Array.from({ length: 50 }, (_, i) => ({
	id: `node-${String(i + 1).padStart(2, "0")}`,
	name: `Worker Node ${i + 1}`,
	status: STATUS[Math.floor(Math.random() * STATUS.length)],	// pick random status
	cpuUsage: Math.floor(Math.random() * 100),		// random percentage
	memoryUsage: Number((Math.random() * 10).toFixed(1)),		// float number
	timestamp: new Date().toISOString(),
}));

// endpoint nodes; in 70% of cases status doesn change, rest of the time it randomly changes
app.get("/api/nodes", (_req, res) => {
	nodes = nodes.map((node) => ({
		...node,
		status: Math.random() < 0.7 ? node.status : STATUS[Math.floor(Math.random() * STATUS.length)],
		cpuUsage: Math.floor(Math.random() * 100),
		memoryUsage: Number((Math.random() * 10).toFixed(1)),
		timestamp: new Date().toISOString(),
	}));
	
	res.json(nodes);
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
