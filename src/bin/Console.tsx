import { useGame } from "@/game";
import { Container, Flex, Input, InputGroup, ScrollArea, Text } from "@chakra-ui/react";
import { useStickToBottom } from "use-stick-to-bottom"
import { shell } from "./shell";
import { banner } from "@/game/utils";
import { useFileSystem } from "./fileSystem";
import { useLoad } from "./commands/load";
import { useAuth } from "./auth";
import { HistoryDisplay, useHistory, type HistoryElement } from "./history";

function Console() {
  const {
    history, 
    updateHistory
   } = useHistory();
  const [game, commands] = useGame();
  const fileSystem = useFileSystem()
  const sticky = useStickToBottom();
  const { selectFile } = useLoad();
  const auth = useAuth();

  const shellFunction = shell(
    selectFile,
    auth,
    game,
    commands,
    fileSystem,
  );

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
                shell={shellFunction}
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

function ConsoleInput({ updateHistory, history, shell }: { 
  updateHistory: (newEntry: { input: string; output: string }) => void,
  history: HistoryElement[],
  shell: (input: string) => string,
}) {
  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const commandInput = e.currentTarget.value;
      const result = shell(commandInput);
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
