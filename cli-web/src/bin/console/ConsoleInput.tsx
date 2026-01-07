import { InputGroup, Input, Text, Flex } from "@chakra-ui/react";
import type { HistoryElement } from "../history";
import type { UserInfo } from "../auth";
import type { Shell } from "../shell";
import { useState } from "react";

export function ConsoleInput({ 
  updateHistory, history, shell, userInfo
}: {
  updateHistory: (newEntry: { input: string; output: string; }) => void;
  history: HistoryElement[];
  shell: Shell;
  userInfo: UserInfo;
}) {
  const [input, setInput] = useState<string>("");

  const handleOnKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const commandInput = e.currentTarget.value;
      const result = await shell(commandInput);
      updateHistory({ input: commandInput, output: result });
      console.log(e.currentTarget);
      setInput("");
    }
    if (e.key === "ArrowUp") {
      const lastElement = history.at(-1);
      if (lastElement) {
        setInput(lastElement.input);
      }
    }
    if (e.ctrlKey && e.key === "c") {
      updateHistory({ input: e.currentTarget.value, output: '' });
      setInput("");
    }
  };

  return (
    <Flex pb={4} gap={2} direction={"column"}>
      { userInfo 
        ? <Text color={"green.600"} textStyle={"xs"}>
          {`[user: ${userInfo.name}]`}
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
          onKeyDown={handleOnKeyDown} 
          onChange={e => setInput(e.currentTarget.value)}
          value={input}
        />

      </InputGroup>
    </Flex>
  );
}
