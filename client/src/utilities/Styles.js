export const buildStyle = ( type, properties = {} ) =>
{
    
}


// Only works with tailwind. 
export const getScale = (scale) => {
        switch (scale) {
            case `9`:
                return "text-9xl";
            case `8`:
                return "text-8xl";
            case `7`:
                return "text-7xl";
            case `6`:
                return "text-6xl";
            case `5`:
                return "text-5xl";
            case `4`:
                return "text-4xl";
            case `3`:
                return "text-3xl";
            case `2`:
                return "text-2xl";
            case `1`:
                return "text-xl";
            case `xl`:
                return "text-xl";
            case `lg`:
                return "text-lg";
            case `md`:
                return "text-md";
            case `sm`:
                return "text-sm";
            case `xs`:
                return "text-xs";
            default:
                return "";
        }
    };
