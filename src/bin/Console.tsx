import { useGame, type GameCommands } from "@/game";
import { Container, Flex, Input, InputGroup, ScrollArea, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useStickToBottom } from "use-stick-to-bottom"
import { shell } from "./shell";
import { banner } from "@/game/utils";
import { useFileSystem, type FileSystem } from "./fileSystem";
import type { Game } from "@/game/model";

type HistoryElement = {
  idx: number;
  input: string;
  output: string;
}

function Console() {
  const [history, setHistory] = useState<HistoryElement[]>([]);
  const updateHistory = (newEntry: { input: string; output: string }) => setHistory(prevHistory => 
    [...prevHistory, { idx: prevHistory.length, ...newEntry }]
  );

  const [game, commands] = useGame();
  const fileSystem = useFileSystem()
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
              <ConsoleInput 
                history={history}
                updateHistory={updateHistory}
                game={game}
                gameCommands={commands}
                fileSystem={fileSystem}
              />
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

function ConsoleInput({ updateHistory, game, gameCommands, history, fileSystem }: { 
  updateHistory: (newEntry: { input: string; output: string }) => void,
  history: HistoryElement[],
  game: Game,
  gameCommands: GameCommands, 
  fileSystem: FileSystem
}) {
  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //e.preventDefault();
    if (e.key === "Enter") {
      const commandInput = e.currentTarget.value;
      const result = shell(commandInput, game, gameCommands, fileSystem);
      updateHistory({ input: commandInput, output: result });
      e.currentTarget.value = "";
    }
    if (e.key === "ArrowUp") { 
      const lastElement = history.at(-1);
      if (lastElement) {
        e.currentTarget.value = lastElement.input;
      }
    }
    if (e.ctrlKey && e.key === "c") {
      updateHistory({ input: e.currentTarget.value, output: '' });
      e.currentTarget.value = "";
    }
  };

  return (
    <InputGroup startElement="> " pb={4}>
      <Input 
        autoFocus
        placeholder="Type a command..." 
        backgroundColor="black"
        border={"none"}
        onKeyDown={handleOnKeyDown}
      />
    </InputGroup>
  );
}

export default Console;
