export const FACTOR = 11
export const SOFAWIDTH = 3.27 * FACTOR
export const SOFAHEIGHT = 1.45 * FACTOR

export const ZOOMFACTOR = 1.2

export const INIT_CAMERA_POS = [0,45,90]

export const PERSPECTIVE_CAMERA_CONFIG = {
        FOV : 60,
        aspectRatio : 16/9,
        clipNear : 0.125,
        clipFar : 2048
    }

export const HIGHLIGHT_COLOR = 0x111111
export const HIGHLIGHT_COLOR2 = 0xec0044

export const WHITE = 0xcacdd2
export const BLACK = 0x222328
export const BROWN = 0xa69d94
export const PINK = 0xc4a8b6
export const BLUE_ = 0x848dac

export const CHALK = 0xddd7c9
export const LIGHTGRAY = 0xa1a1a1
export const BEIGE = 0x9b8f86
export const BLUE = 0x1d274b
export const CHARCOALBLACK = 0x141319

export const CHARCOAL = 0x514d4a
export const NAVY = 0x343b55
export const LIGHTGRAY_ = 0x848484
export const BEIGE_ = 0x897d6d

export const TEXTURE_WRAPS = 2
export const TEXTURE_WRAPT = 2

export const TEXTURE_BUMP = 0.1

export const NODESIZE = 0.1 * FACTOR

/* renderer color */
export const RENDERER_COLOR = 0xFFFFFF
export const SKYBOX_COLOR = 0xfafafa
// export const SKYBOX_COLOR = 0x161616

/* floor */
export const RENDER_MIRROR = true
export const FLOOR_COLOR = 0xe2e2e2
export const MIRROR_COLOR = 0xa0a0a0
// export const MIRROR_COLOR = 0x7D7D7D

/* light */
export const AMBIENT_INTENSITY = 0.3
export const SPOT_HEIGHT = 64

export const RENDER_SPOT = false

export const SPOT_COLOR = 0xffffff
export const SPOT_INTENSITY = 0.5
export const SPOT_DISTANCE = 300
export const SPOT_ANGLE = 3.05
export const SPOT_PENUMBRA = 0.3
export const SPOT_DECAY = 1

/* root folder for loading assets */

export const ROOT = 'https://xgui3783.github.io/'
// export const ROOT = 'http://localhost/kopa2/'

export const PRICE = {
    SOFA : 330,
    ARMREST : 220,
    BACKREST : 110,
    CUSHION : 30
}

export const SCALE = 1000 / 37 /11 * FACTOR