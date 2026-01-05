import { Container, Flex, Input, InputGroup, ScrollArea, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useStickToBottom } from "use-stick-to-bottom"
import { shell } from "./shell";
import { useGame, type GameCommands } from "./game";
import { banner } from "./game/utils";

type HistoryElement = {
  idx: number;
  input: string;
  output?: string;
}

function Console() {
  const [history, setHistory] = useState<HistoryElement[]>([]);
  const updateHistory = (newEntry: { input: string; output?: string }) => setHistory(prevHistory => 
    [...prevHistory, { idx: prevHistory.length, ...newEntry }]
  );

  const commands = useGame();
  const sticky = useStickToBottom();

  return (
    <Flex 
      direction={"column"} 
      align={"start"}  
      py={6}
    >
      <ScrollArea.Root height="50rem" variant={"hover"}>
        <ScrollArea.Viewport ref={sticky.scrollRef} >
          <ScrollArea.Content 
            spaceY="2" 
            textStyle="sm" 
            ref={sticky.contentRef} 
            color={"green.500"} 
            fontFamily={"mono"}
          >
            
            <Container>
              <pre>{banner}</pre>
            </Container>
            <Container>
              <Text>{`> Welcome to the Dungeon web!`}</Text>
              </Container>
            <Container>
              <Text>{`> Type "help" to see a list of available commands.`}</Text>
            </Container>
            
            <HistoryDisplay history={history} />

            <Container pt={2}>
              <ConsoleInput updateHistory={updateHistory} gameCommands={commands}/>
            </Container>
          
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar>
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner />
      </ScrollArea.Root>
    </Flex>
  );
}

function HistoryDisplay({ 
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

function ConsoleInput({ updateHistory, gameCommands }: { 
  updateHistory: (newEntry: { input: string; output?: string }) => void,
  gameCommands: GameCommands, 
}) {
  return (
    <InputGroup startElement="> " pb={4}>
      <Input 
        autoFocus
        placeholder="Type a command..." 
        backgroundColor="black"
        border={"none"}
        onKeyDown={e => {
          if (e.key === "Enter") {
            const commandInput = e.currentTarget.value;
            const result = shell(commandInput, gameCommands);
            updateHistory({ input: commandInput, output: result });
            e.currentTarget.value = "";
          }
        }}
      />
    </InputGroup>
  );
}

export default Console;
