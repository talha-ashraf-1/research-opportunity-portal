export function Star({className = ""}){
    return (
        <svg className={`star ${className}`} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0 L14.4 9.6 L24 12 L14.4 14.4 L12 24 L9.6 14.4 L0 12 L9.6 9.6 Z" />
        </svg>
    );
}

export function Divider({className = ""}){
    return (
        <div className={`divider ${className}`} aria-hidden="true">
            <span />
            <Star />
            <span />
        </div>
    );
}

export function Background(){
    return (
        <div className="marble" aria-hidden="true">
            <svg width="100%" height="100%" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
                <defs>
                    <filter id="wineClouds" x="0" y="0" width="1600" height="900" filterUnits="userSpaceOnUse">
                        <feTurbulence type="fractalNoise" baseFrequency="0.0035 0.006" numOctaves="4" seed="4" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0.30  0 0 0 0 0.02  0 0 0 0 0.05  3.2 0 0 0 -1.35" />
                    </filter>
                    <filter id="wineVeins" x="0" y="0" width="1600" height="900" filterUnits="userSpaceOnUse">
                        <feTurbulence type="turbulence" baseFrequency="0.006 0.010" numOctaves="5" seed="11" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0.50  0 0 0 0 0.03  0 0 0 0 0.08  -8 0 0 0 1.05" />
                    </filter>
                    <filter id="goldVeins" x="0" y="0" width="1600" height="900" filterUnits="userSpaceOnUse">
                        <feTurbulence type="turbulence" baseFrequency="0.0045 0.0075" numOctaves="4" seed="23" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0.86  0 0 0 0 0.66  0 0 0 0 0.34  -26 0 0 0 1.0" />
                    </filter>
                </defs>
                <rect width="1600" height="900" filter="url(#wineClouds)" />
                <rect width="1600" height="900" filter="url(#wineVeins)" opacity="0.85" />
                <rect width="1600" height="900" filter="url(#goldVeins)" opacity="0.5" />
                <g className="cracks" fill="none" stroke="#d9b26a" strokeLinejoin="round" strokeLinecap="round">
                    <path d="M1120 0 L1165 34 L1210 28 L1262 70 L1318 82 L1350 128 L1412 150 L1448 196 L1510 214 L1546 262 L1600 280" />
                    <path d="M1350 128 L1372 96 L1420 88" />
                    <path d="M1448 196 L1470 232 L1462 270" />
                    <path d="M372 0 L345 38 L318 62 L286 70 L262 112 L226 130 L205 176 L168 198 L142 250 L96 268 L60 310" />
                    <path d="M262 112 L300 140 L296 176" />
                    <path d="M330 812 L296 826 L262 850 L240 880 L226 900" />
                    <path d="M296 826 L330 850 L322 880" />
                    <path d="M1600 560 L1540 600 L1498 590 L1452 640 L1410 636 L1366 700 L1318 706 L1290 752 L1236 770" />
                    <path d="M1452 640 L1470 676 L1520 690" />
                    <path d="M290 590 L262 622 L236 664 L190 690 L140 734" />
                </g>
            </svg>
        </div>
    );
}

export function EdgeOrnaments(){
    return (
        <div className="edge-ornaments" aria-hidden="true">
            {["left", "right"].map((side) => (
                <div key={side} className={`edge edge-${side}`}>
                    <span className="edge-line" />
                    <span className="edge-ring" />
                    <Star className="edge-star" />
                    <span className="edge-dot dot-a" />
                    <span className="edge-dot dot-b" />
                    <span className="edge-dot dot-c" />
                    <span className="edge-dot dot-d" />
                </div>
            ))}
        </div>
    );
}
