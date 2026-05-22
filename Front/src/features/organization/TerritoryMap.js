import styles from './TerritorySchemes.module.css';

const buildings = [
  { id: '8/8', x: 250, y: 18, w: 130, h: 76, accent: true },
  { id: '8/7', x: 56, y: 18, w: 132, h: 80 },
  { id: '7/10', x: 18, y: 142, w: 64, h: 112 },
  { id: '7/9', x: 102, y: 142, w: 64, h: 112 },
  { id: '7/8', x: 188, y: 142, w: 64, h: 112 },
  { id: '7/7', x: 272, y: 126, w: 70, h: 128 },
  { id: '7/5', x: 450, y: 132, w: 64, h: 108 },
  { id: '7/4', x: 566, y: 132, w: 64, h: 108 },
  { id: '6/10', x: 0, y: 278, w: 86, h: 86, warm: true },
  { id: '6/9', x: 106, y: 278, w: 66, h: 86, warm: true },
  { id: '6/8', x: 206, y: 268, w: 68, h: 94, accent: true },
  { id: '6/5', x: 474, y: 272, w: 74, h: 96 },
  { id: '5/8', x: 300, y: 398, w: 74, h: 78 },
  { id: '5/7', x: 404, y: 408, w: 88, h: 56 },
  { id: '5/6', x: 500, y: 386, w: 88, h: 78 },
  { id: '5/5', x: 604, y: 386, w: 70, h: 78 },
  { id: '4/12', x: 14, y: 524, w: 80, h: 58 },
  { id: '4/11', x: 110, y: 524, w: 78, h: 58, accent: true },
  { id: '4/10', x: 208, y: 512, w: 76, h: 72 },
  { id: '4/9', x: 310, y: 514, w: 58, h: 98 },
  { id: '4/8', x: 392, y: 514, w: 58, h: 98 },
  { id: '4/7', x: 474, y: 514, w: 58, h: 98 },
  { id: '4/6', x: 556, y: 514, w: 58, h: 98 },
  { id: '4/5', x: 640, y: 512, w: 62, h: 98 },
  { id: '3/12', x: 62, y: 642, w: 58, h: 98 },
  { id: '3/11', x: 148, y: 642, w: 58, h: 98 },
  { id: '3/10', x: 232, y: 642, w: 58, h: 98 },
  { id: '3/9', x: 318, y: 642, w: 94, h: 70 },
  { id: '3/8', x: 428, y: 642, w: 70, h: 70 },
  { id: '3/7', x: 528, y: 618, w: 56, h: 98, accent: true },
  { id: '3/5', x: 622, y: 622, w: 80, h: 74 },
];

const routeArrows = [
  { x1: 300, y1: 86, x2: 276, y2: 166 },
  { x1: 246, y1: 354, x2: 236, y2: 292 },
  { x1: 112, y1: 614, x2: 112, y2: 548 },
  { x1: 534, y1: 594, x2: 526, y2: 548 },
];

function TerritoryMap() {
  return (
    <div className={styles.mapShell}>
      <svg viewBox="0 0 720 760" className={styles.mapSvg} role="img" aria-label="Схема территории базы Спектр">
        <defs>
          <marker id="territoryArrow" markerWidth="10" markerHeight="10" refX="4" refY="3" orient="auto">
            <path d="M0 0 6 3 0 6z" className={styles.mapArrowHead} />
          </marker>
        </defs>

        <rect width="720" height="760" rx="20" className={styles.mapBackground} />
        <path d="M0 132 C180 122 320 112 720 96" className={styles.mapRoad} />
        <path d="M0 272 H720" className={styles.mapRoad} />
        <path d="M0 390 H720" className={styles.mapRoad} />
        <path d="M0 498 H720" className={styles.mapRoad} />
        <path d="M0 630 H720" className={styles.mapRoad} />
        <path d="M210 0 L230 390" className={styles.mapRoadThin} />
        <path d="M452 250 L462 510" className={styles.mapRoadThin} />
        <path d="M600 350 L610 640" className={styles.mapRoadThin} />

        {buildings.map((building) => (
          <g key={building.id}>
            <rect
              x={building.x}
              y={building.y}
              width={building.w}
              height={building.h}
              rx="8"
              className={[
                styles.mapBuilding,
                building.accent ? styles.mapBuildingAccent : '',
                building.warm ? styles.mapBuildingWarm : '',
              ].filter(Boolean).join(' ')}
            />
            <text x={building.x + building.w / 2} y={building.y + building.h / 2 + 4} className={styles.mapLabel}>
              {building.id}
            </text>
          </g>
        ))}

        {routeArrows.map((arrow) => (
          <path
            key={`${arrow.x1}-${arrow.y1}`}
            d={`M${arrow.x1} ${arrow.y1} L${arrow.x2} ${arrow.y2}`}
            className={styles.mapArrow}
            markerEnd="url(#territoryArrow)"
          />
        ))}

        <g>
          <circle cx="254" cy="276" r="9" className={styles.mapPin} />
          <text x="270" y="280" className={styles.mapCompanyLabel}>Турбулентность-Дон</text>
        </g>
        <g>
          <circle cx="386" cy="44" r="9" className={styles.mapPin} />
          <text x="402" y="49" className={styles.mapCompanyLabel}>НПП Сармат</text>
        </g>
      </svg>
    </div>
  );
}

export default TerritoryMap;
