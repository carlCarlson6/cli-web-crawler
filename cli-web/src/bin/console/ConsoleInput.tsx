import { InputGroup, Input, Text, Flex } from "@chakra-ui/react";
import type { HistoryElement } from "../history";
import type { UserInfo } from "../auth";

export function ConsoleInput({ 
  updateHistory, history, shell, userInfo
}: {
  updateHistory: (newEntry: { input: string; output: string; }) => void;
  history: HistoryElement[];
  shell: (input: string) => string;
  userInfo: UserInfo;
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
    <Flex pb={4} gap={2} direction={"column"}>
      { userInfo 
        ? <Text color={"green.600"} textStyle={"xs"}>
          {`[user: ${userInfo.email}]`}
        </Text> 
        : null
      }
      <InputGroup startElement={"> "}>
        <Input
          autoFocus
          placeholder="Type a command..."
          backgroundColor="black"
          border={"none"}
          variant={"flushed"}
          onKeyDown={handleOnKeyDown} />
      </InputGroup>
    </Flex>
  );
}
