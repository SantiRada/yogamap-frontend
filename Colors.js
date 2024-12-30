import { useColorScheme } from "react-native"

function useColors () {

    const isDark = useColorScheme() == "dark"

    const mainBlue = isDark ? "#57ada4" : "#468c8a"

    const text = isDark ? "white" : "black"

    const antiText = !isDark ? "white" : "black"

    const ligthText = isDark ? "#ffffff68" : "#00000068"

    const superLigthText = isDark ? "#ffffff05" : "#00000005"

    const background = isDark ? "#1A122E" : "#ffffff"

    const placeholder = isDark ? "#ffffffa1" : "#000000a1"

    const inputBG = isDark ? "#3C2C61" : "#bdafdd3a"

    const navBar = isDark ? "#3C2C61" : "#d3d2e6ff"

    const headerIcons = isDark ? "#E3D8FF" : "#8C5BFF"

    const homeCards = isDark ? "#3C2C61" : "#bdafdd3a"

    const text2 = isDark ? "#E3D8FF" : "black"

    return Colors = {
        mainBlue,
        antiText,
        text,
        ligthText,
        background,
        placeholder,
        inputBG,
        navBar,
        headerIcons,
        homeCards,
        text2,
        superLigthText,
      }
    }

export default useColors