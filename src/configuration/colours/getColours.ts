export type ColourVariants =
    | 'dark.css'
    | 'light.css'
    | 'matrix.css'
    | 'midnight.css'

const importColours = (stylesheet: ColourVariants | undefined) => {
    switch (stylesheet) {
        case 'dark.css':
            return import('./components/Dark')

        case 'matrix.css':
            return import('./components/Matrix')

        case 'midnight.css':
            return import('./components/Midnight')

        case 'light.css':
            return import('./components/Light')

        default:
            return import('./components/Dark')
    }
}

export default importColours
