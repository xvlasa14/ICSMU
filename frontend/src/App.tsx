import { useEffect, useState } from "react";

type NodeStatus = "online" | "offline" | "maintenance";

const statusClasses: Record<NodeStatus, string> = {
  online: "bg-green-100 text-green-800 border-1 border-green-200",
  maintenance: "bg-orange-100 text-orange-800 border-1 border-orange-200",
  offline: "bg-red-100 text-red-800 border-1 border-red-200",
};


interface Node {
  id: string;
  name: string;
  status: NodeStatus;
  cpuUsage: number;
  memoryUsage: number;
  timestamp: string;
}

const ENABLE_CHANGES = true; // utility constatnt

export default function App() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const fetchNodes = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/nodes");

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: Node[] = await res.json();
      setNodes(data);
      setError(null);
    } catch {
      setError("Failed to fetch nodes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
    if (!ENABLE_CHANGES) return;
    const intervalId = setInterval(fetchNodes, 2000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <div className="p-4">Loading…</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="flex flex-col w-[70vw] mx-auto">
      <label>
        <input type="checkbox" checked={showOnlineOnly} onChange={(e) => setShowOnlineOnly(e.target.checked)} className="hidden"/>
        <span className={`items-center flex gap-2 text-sm font-semibold rounded-md align-center justify-start p-3 w-fit cursor-pointer my-5 border-1 ${ showOnlineOnly ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-600 hover:text-emerald-700' : 'bg-slate-100 border-slate-200 hover:bg-slate-300 hover:border-slate-400'}`}>ONLINE ONLY</span>
        </label>
      <div className="flex flex-row flex-wrap mb-5 gap-2 justify-center">
        {nodes
        .filter((node) => !showOnlineOnly || node.status === "online")
        .map((node) => (
          <div
            key={node.id}
            className={`border-2 p-5 bg-slate-50 rounded-md flex flex-col gap-4 ${node.status === "offline" ? "border-rose-100" : "border-slate-200"}`}
          >
            <p
              className={`rounded-2xl text-right inline-block px-3 py-1 ml-auto text-xs ${statusClasses[node.status]}`}
            >
              {node.status}
            </p>
            <div className="">
              <p className="text-lg text-center font-semibold">{node.name}</p>
              <div className="pt-2">
                <p className="flex flex-row justify-between">
                  CPU usage:{" "}
                  <span className="flex flex-nowrap gap-2 items-center">
                    {node.cpuUsage}%
                    {node.cpuUsage < 80 && (
                      <span className="size-[1.1rem] rounded-full block bg-red-700 border-1 border-red-800 text-red-100 font-black text-[0.6rem] text-center">
                        !
                      </span>
                    )}
                  </span>
                </p>
                <p className="flex flex-row justify-between">
                  Memory usage: <span>{node.memoryUsage} GB</span>
                </p>
                <p className="pt-4 font-mono">{node.timestamp}</p>
              </div>
              <p className="text-xs pt-4 font-mono">{node.id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
