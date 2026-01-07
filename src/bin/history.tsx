import { Container } from "@chakra-ui/react";
import { useState } from "react";

export type HistoryElement = {
  idx: number;
  input: string;
  output: string;
}

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryElement[]>([]);
  
  return {
    history,
    updateHistory: (
      newEntry: { input: string; output: string }
    ) => setHistory(prevHistory => [...prevHistory, { idx: prevHistory.length, ...newEntry }]),
  };
}

export function HistoryDisplay({ 
  history,
}: { 
  history: { input: string; output?: string }[],
}) {
  return (<>
    {history.map((line, index) => (
      <Container key={index} >
        <pre>
          {`> ${line.input}\n${line.output}`}
        </pre>
      </Container>
      ))}
  </>);
}