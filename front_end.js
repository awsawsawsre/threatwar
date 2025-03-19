import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { BarChart } from "@/components/ui/bar-chart";

export default function SOCDashboard() {
  const [threats, setThreats] = useState([]);
  const [forensicReports, setForensicReports] = useState([]);
  const [darkWebAlerts, setDarkWebAlerts] = useState([]);
  const [behavioralAlerts, setBehavioralAlerts] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000/ws");
    ws.onmessage = (event) => {
      setThreats(JSON.parse(event.data));
    };
    return () => ws.close();
  }, []);

  const handleAction = (threat, action) => {
    alert(`${action} action taken on: ${threat.threat}`);
    if (action === "Trigger Forensic Analysis") {
      const report = {
        threat: threat.threat,
        details: `Memory dump and log correlation for ${threat.threat} completed.`,
        timestamp: new Date().toLocaleString()
      };
      setForensicReports((prev) => [...prev, report]);
    }
  };

  const monitorDarkWeb = () => {
    const alert = {
      alert: "Compromised credentials found",
      source: "Dark Web Monitoring",
      timestamp: new Date().toLocaleString()
    };
    setDarkWebAlerts((prev) => [...prev, alert]);
  };

  const detectBehavioralAnomalies = () => {
    const alert = {
      user: "User123",
      anomaly: "Unusual login time and location detected",
      risk_score: Math.floor(Math.random() * 100),
      timestamp: new Date().toLocaleString()
    };
    setBehavioralAlerts((prev) => [...prev, alert]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Security Operations Center Dashboard</h1>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Threat</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>MITRE ATT&CK</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {threats.map((threat, index) => (
                <TableRow key={index}>
                  <TableCell>{threat.threat}</TableCell>
                  <TableCell className={threat.severity === "Critical" ? "text-red-600 font-bold" : "text-yellow-600"}>
                    {threat.severity}
                  </TableCell>
                  <TableCell>
                    <Progress value={threat.risk_score} max={100} className={threat.risk_score > 80 ? "bg-red-600" : "bg-yellow-600"} />
                    {threat.risk_score}%
                  </TableCell>
                  <TableCell>{threat.mitre_attack_tactic}</TableCell>
                  <TableCell>
                    <button className="px-2 py-1 bg-blue-500 text-white rounded mr-2" onClick={() => handleAction(threat, "Isolate Endpoint")}>
                      Isolate
                    </button>
                    <button className="px-2 py-1 bg-red-500 text-white rounded mr-2" onClick={() => handleAction(threat, "Trigger Forensic Analysis")}>
                      Forensics
                    </button>
                    <button className="px-2 py-1 bg-green-500 text-white rounded mr-2" onClick={() => handleAction(threat, "Mitigate")}>
                      Mitigate
                    </button>
                    <button className="px-2 py-1 bg-purple-500 text-white rounded" onClick={monitorDarkWeb}>
                      Monitor Dark Web
                    </button>
                    <button className="px-2 py-1 bg-orange-500 text-white rounded" onClick={detectBehavioralAnomalies}>
                      Detect Behavioral Anomalies
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <h2 className="text-xl font-bold mt-6">Threat Statistics</h2>
      <BarChart data={threats.map((threat) => ({ label: threat.threat, value: threat.risk_score }))} />
      <h2 className="text-xl font-bold mt-6">Forensic Reports</h2>
      {forensicReports.length > 0 ? (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Threat</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forensicReports.map((report, index) => (
                  <TableRow key={index}>
                    <TableCell>{report.threat}</TableCell>
                    <TableCell>{report.details}</TableCell>
                    <TableCell>{report.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <p>No forensic reports yet.</p>
      )}
      <h2 className="text-xl font-bold mt-6">Dark Web Alerts</h2>
      {darkWebAlerts.length > 0 ? (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alert</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {darkWebAlerts.map((alert, index) => (
                  <TableRow key={index}>
                    <TableCell>{alert.alert}</TableCell>
                    <TableCell>{alert.source}</TableCell>
                    <TableCell>{alert.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <p>No dark web alerts yet.</p>
      )}
      <h2 className="text-xl font-bold mt-6">Behavioral Analytics Alerts</h2>
      {behavioralAlerts.length > 0 ? (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Anomaly</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {behavioralAlerts.map((alert, index) => (
                  <TableRow key={index}>
                    <TableCell>{alert.user}</TableCell>
                    <TableCell>{alert.anomaly}</TableCell>
                    <TableCell>{alert.risk_score}%</TableCell>
                    <TableCell>{alert.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <p>No behavioral anomalies detected yet.</p>
      )}
    </div>
  );
}
