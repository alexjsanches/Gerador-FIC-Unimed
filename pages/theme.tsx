import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  components: {
    Input: {
      variants: {
        filled: {
          bg: 'green.200',
          borderRadius: 'sm',
          _hover: {
            bg: 'blue.300',
          },
          _focus: {
            bg: 'red.300',
            borderColor: 'yellow.500',
          },
        },
      },
    },
  },
})

export default theme
