import { extendTheme } from "native-base";

//config Theme
const config = {
    useSystemColor: false,
    initialColorMode: "light",
}

const colors = {
    base:"#111111",
    subbase: "#FCFBFC",
    altsub: "#A57AED",
    altbase:"#2DD7A6"
}

export default extendTheme({config,colors});