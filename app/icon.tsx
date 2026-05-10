import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: '#0a0a0a',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#00c896',
        fontWeight: 800,
        fontSize: 20,
        fontFamily: 'sans-serif',
        borderRadius: 6,
        border: '1px solid #2a2a2a',
      }}
    >
      R
    </div>,
    { ...size },
  )
}
