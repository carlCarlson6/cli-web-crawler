import { Container, Flex, ScrollArea } from "@chakra-ui/react";
import { useStickToBottom } from "use-stick-to-bottom"
import { useShell } from "../shell";
import { HistoryDisplay, InitialTextDisplay, useHistory } from "../history";
import { ConsoleInput } from "./ConsoleInput";

export default function Console() {
  const {
    history, 
    updateHistory
   } = useHistory();
  const sticky = useStickToBottom();
  const {shell, user} = useShell();

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
            <InitialTextDisplay />
            
            <HistoryDisplay history={history} />

            <Container pt={2}>
              <ConsoleInput 
                history={history}
                updateHistory={updateHistory}
                shell={shell}
                userInfo={user}
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
