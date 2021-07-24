import { ColorInput } from 'tinycolor2';
import type { ThemeMap, IShadesInit } from './types';
export declare type Theme = typeof light;
export declare const SHADES_BASE: {
    red: string;
    orange: string;
    yellow: string;
    green: string;
    blue: string;
    purple: string;
    magenta: string;
    gray: string;
};
export declare const THEME_BASE: {
    _config: {};
    html: {
        font: {
            size: string;
        };
    };
    body: {
        background: string;
    };
    color: {
        primary: string;
        success: string;
        warning: string;
        danger: string;
        secondary: string;
        white: string;
        black: string;
    };
    font: {
        family: {
            normal: string;
            mono: string;
        };
        color: string;
        size: string;
        weight: number;
    };
    position: {
        spacer: string;
        margin: string;
        padding: string;
    };
    breakpoint: {
        tablet: string;
        desktop: string;
        wide: string;
        ultrawide: string;
    };
    radius: {
        small: string;
        normal: string;
        large: string;
    };
    close: {
        small: string;
        normal: string;
        large: string;
    };
    button: {
        font: {
            normal: string;
            small: string;
            large: string;
        };
        height: {
            small: string;
            normal: string;
            large: string;
        };
        loading: {
            height: {
                small: string;
                large: string;
                normal: string;
            };
        };
    };
    toggle: {
        switch: {
            speed: string;
            timing: string;
        };
        width: {
            small: string;
            normal: string;
            large: string;
        };
        height: {
            small: string;
            normal: string;
            large: string;
        };
        gutter: {
            small: string;
            normal: string;
            large: string;
        };
        radius: {
            small: string;
            normal: string;
            large: string;
        };
    };
    slider: {
        width: string;
        handle: {
            small: string;
            normal: string;
            large: string;
        };
        height: {
            small: string;
            normal: string;
            large: string;
        };
    };
    step: {
        marker: {
            xsmall: string;
            small: string;
            normal: string;
            large: string;
        };
        bar: {
            xsmall: string;
            small: string;
            normal: string;
            large: string;
        };
        border: {
            xsmall: string;
            small: string;
            normal: string;
            large: string;
        };
    };
    pager: {
        height: {
            small: string;
            normal: string;
            large: string;
        };
    };
};
/**
 * Generate light versions of semantic colors.
 *
 * @param theme the current theme.
 * @param semanticColors an array of semantic color keys.
 * @returns the current theme.
 */
export declare const createSemanticLight: <C extends Record<string, string>, S extends keyof C>(colors: C, semanticColors?: S[]) => Record<keyof C, string>;
/**
 * Creates object of color shades based on base color.
 *
 * @param color the base color to create shades from.
 * @returns an object containing shades from 100-900
 */
export declare const createShades: (color: ColorInput) => {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
};
/**
 * Breaks out each color into Hue, Saturation and Lightness variables.
 *
 * @param colors the colors to be processed.
 * @returns the theme colors object.
 */
export declare const breakoutColors: <C extends Record<string, string>>(colors: C) => C;
/**
 * A simple merge to merge two objects preserving the target
 * if the source value is undefined. This largely ensures our typings also.
 *
 * @example
 * const themeNode =
 *   mergeThemeNode({ font: { size: '1rem'}}, { font: { size: '.9rem', weight: 400  } });
 * themeNode = { font: { size: '1rem', size: 400 }};
 *
 * @param target the target node to be merged.
 * @param source the source node to merge with.
 * @returns the resulting merged theme node.
 */
export declare const mergeThemeNode: <T, S>(target: T, source?: S) => T & S;
/**
 * Merges theme prerving default values when source value is undefined.
 * Creates clone when overrides not present.
 *
 * @param overrides properties to override the base theme with.
 * @returns a new overridden theme.
 */
export declare const createTheme: <O extends ThemeMap, S extends Record<keyof IShadesInit, string>, B extends {
    _config: {};
    html: {
        font: {
            size: string;
        };
    };
    body: {
        background: string;
    };
    color: {
        primary: string;
        success: string;
        warning: string;
        danger: string;
        secondary: string;
        white: string;
        black: string;
    };
    font: {
        family: {
            normal: string;
            mono: string;
        };
        color: string;
        size: string;
        weight: number;
    };
    position: {
        spacer: string;
        margin: string;
        padding: string;
    };
    breakpoint: {
        tablet: string;
        desktop: string;
        wide: string;
        ultrawide: string;
    };
    radius: {
        small: string;
        normal: string;
        large: string;
    };
    close: {
        small: string;
        normal: string;
        large: string;
    };
    button: {
        font: {
            normal: string;
            small: string;
            large: string;
        };
        height: {
            small: string;
            normal: string;
            large: string;
        };
        loading: {
            height: {
                small: string;
                large: string;
                normal: string;
            };
        };
    };
    toggle: {
        switch: {
            speed: string;
            timing: string;
        };
        width: {
            small: string;
            normal: string;
            large: string;
        };
        height: {
            small: string;
            normal: string;
            large: string;
        };
        gutter: {
            small: string;
            normal: string;
            large: string;
        };
        radius: {
            small: string;
            normal: string;
            large: string;
        };
    };
    slider: {
        width: string;
        handle: {
            small: string;
            normal: string;
            large: string;
        };
        height: {
            small: string;
            normal: string;
            large: string;
        };
    };
    step: {
        marker: {
            xsmall: string;
            small: string;
            normal: string;
            large: string;
        };
        bar: {
            xsmall: string;
            small: string;
            normal: string;
            large: string;
        };
        border: {
            xsmall: string;
            small: string;
            normal: string;
            large: string;
        };
    };
    pager: {
        height: {
            small: string;
            normal: string;
            large: string;
        };
    };
}>(overrides?: O | undefined, shades?: S, base?: B) => B & {
    color: S;
};
declare const light: {
    _config: {};
    html: {
        font: {
            size: string;
        };
    };
    body: {
        background: string;
    };
    color: {
        primary: string;
        success: string;
        warning: string;
        danger: string;
        secondary: string;
        white: string;
        black: string;
    };
    font: {
        family: {
            normal: string;
            mono: string;
        };
        color: string;
        size: string;
        weight: number;
    };
    position: {
        spacer: string;
        margin: string;
        padding: string;
    };
    breakpoint: {
        tablet: string;
        desktop: string;
        wide: string;
        ultrawide: string;
    };
    radius: {
        small: string;
        normal: string;
        large: string;
    };
    close: {
        small: string;
        normal: string;
        large: string;
    };
    button: {
        font: {
            normal: string;
            small: string;
            large: string;
        };
        height: {
            small: string;
            normal: string;
            large: string;
        };
        loading: {
            height: {
                small: string;
                large: string;
                normal: string;
            };
        };
    };
    toggle: {
        switch: {
            speed: string;
            timing: string;
        };
        width: {
            small: string;
            normal: string;
            large: string;
        };
        height: {
            small: string;
            normal: string;
            large: string;
        };
        gutter: {
            small: string;
            normal: string;
            large: string;
        };
        radius: {
            small: string;
            normal: string;
            large: string;
        };
    };
    slider: {
        width: string;
        handle: {
            small: string;
            normal: string;
            large: string;
        };
        height: {
            small: string;
            normal: string;
            large: string;
        };
    };
    step: {
        marker: {
            xsmall: string;
            small: string;
            normal: string;
            large: string;
        };
        bar: {
            xsmall: string;
            small: string;
            normal: string;
            large: string;
        };
        border: {
            xsmall: string;
            small: string;
            normal: string;
            large: string;
        };
    };
    pager: {
        height: {
            small: string;
            normal: string;
            large: string;
        };
    };
} & {
    color: Record<keyof IShadesInit, string>;
};
export declare const THEMES: {
    light: {
        _config: {};
        html: {
            font: {
                size: string;
            };
        };
        body: {
            background: string;
        };
        color: {
            primary: string;
            success: string;
            warning: string;
            danger: string;
            secondary: string;
            white: string;
            black: string;
        };
        font: {
            family: {
                normal: string;
                mono: string;
            };
            color: string;
            size: string;
            weight: number;
        };
        position: {
            spacer: string;
            margin: string;
            padding: string;
        };
        breakpoint: {
            tablet: string;
            desktop: string;
            wide: string;
            ultrawide: string;
        };
        radius: {
            small: string;
            normal: string;
            large: string;
        };
        close: {
            small: string;
            normal: string;
            large: string;
        };
        button: {
            font: {
                normal: string;
                small: string;
                large: string;
            };
            height: {
                small: string;
                normal: string;
                large: string;
            };
            loading: {
                height: {
                    small: string;
                    large: string;
                    normal: string;
                };
            };
        };
        toggle: {
            switch: {
                speed: string;
                timing: string;
            };
            width: {
                small: string;
                normal: string;
                large: string;
            };
            height: {
                small: string;
                normal: string;
                large: string;
            };
            gutter: {
                small: string;
                normal: string;
                large: string;
            };
            radius: {
                small: string;
                normal: string;
                large: string;
            };
        };
        slider: {
            width: string;
            handle: {
                small: string;
                normal: string;
                large: string;
            };
            height: {
                small: string;
                normal: string;
                large: string;
            };
        };
        step: {
            marker: {
                xsmall: string;
                small: string;
                normal: string;
                large: string;
            };
            bar: {
                xsmall: string;
                small: string;
                normal: string;
                large: string;
            };
            border: {
                xsmall: string;
                small: string;
                normal: string;
                large: string;
            };
        };
        pager: {
            height: {
                small: string;
                normal: string;
                large: string;
            };
        };
    } & {
        color: Record<keyof IShadesInit, string>;
    };
    dark: {
        _config: {};
        html: {
            font: {
                size: string;
            };
        };
        body: {
            background: string;
        };
        color: {
            primary: string;
            success: string;
            warning: string;
            danger: string;
            secondary: string;
            white: string;
            black: string;
        };
        font: {
            family: {
                normal: string;
                mono: string;
            };
            color: string;
            size: string;
            weight: number;
        };
        position: {
            spacer: string;
            margin: string;
            padding: string;
        };
        breakpoint: {
            tablet: string;
            desktop: string;
            wide: string;
            ultrawide: string;
        };
        radius: {
            small: string;
            normal: string;
            large: string;
        };
        close: {
            small: string;
            normal: string;
            large: string;
        };
        button: {
            font: {
                normal: string;
                small: string;
                large: string;
            };
            height: {
                small: string;
                normal: string;
                large: string;
            };
            loading: {
                height: {
                    small: string;
                    large: string;
                    normal: string;
                };
            };
        };
        toggle: {
            switch: {
                speed: string;
                timing: string;
            };
            width: {
                small: string;
                normal: string;
                large: string;
            };
            height: {
                small: string;
                normal: string;
                large: string;
            };
            gutter: {
                small: string;
                normal: string;
                large: string;
            };
            radius: {
                small: string;
                normal: string;
                large: string;
            };
        };
        slider: {
            width: string;
            handle: {
                small: string;
                normal: string;
                large: string;
            };
            height: {
                small: string;
                normal: string;
                large: string;
            };
        };
        step: {
            marker: {
                xsmall: string;
                small: string;
                normal: string;
                large: string;
            };
            bar: {
                xsmall: string;
                small: string;
                normal: string;
                large: string;
            };
            border: {
                xsmall: string;
                small: string;
                normal: string;
                large: string;
            };
        };
        pager: {
            height: {
                small: string;
                normal: string;
                large: string;
            };
        };
    } & {
        color: Record<keyof IShadesInit, string>;
    };
};
export {};
