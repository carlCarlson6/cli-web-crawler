import { Box } from "@chakra-ui/react"
import Console from "./bin/Console"

function App() {
  return (
    <Box 
      backgroundColor="black" 
      position="relative" 
      h={"100vh"} 
      borderRadius="md"
      mx={16}
      pt={8}
    >
      <Box backgroundColor="gray.950" borderRadius="md" width={"full"}>
        <Console />
      </Box> 
    </Box>
)
}

export default App
