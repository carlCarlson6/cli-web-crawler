import { InputGroup, Input, Box, Text } from "@chakra-ui/react";
import type { HistoryElement } from "../history";
import { useAuth } from "@clerk/clerk-react";

export function ConsoleInput({ updateHistory, history, shell }: {
  updateHistory: (newEntry: { input: string; output: string; }) => void;
  history: HistoryElement[];
  shell: (input: string) => string;
}) {
  const {isLoaded, isSignedIn, userId } = useAuth();

  const startElement = isLoaded && isSignedIn
    ? userId
    : null;

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
    <Box pb={4} gap={2}>
      { startElement 
        ? <Text color={"green.600"}>
          {`user: [${startElement}]`}
        </Text> 
        : null
      }
      <InputGroup startElement={"> "}>
        <Input
          autoFocus
          placeholder="Type a command..."
          backgroundColor="black"
          border={"none"}
          onKeyDown={handleOnKeyDown} />
      </InputGroup>
    </Box>
  );
}
