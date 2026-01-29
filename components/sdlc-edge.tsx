import React from 'react';
import { BaseEdge, EdgeProps, getSmoothStepPath } from 'reactflow';

/**
 * Custom SDLC edge that prefers to route around nodes instead of running
 * directly behind/through them.
 *
 * - Forward edges (left → right in the typical layout) use a standard
 *   smooth step path.
 * - Backward/loop edges (right → left) are routed in a wide arc above the
 *   nodes so the connection stays visually clear.
 */
export function SdlcEdge(props: EdgeProps) {
  const {
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    markerEnd,
    style,
  } = props;

  // For the usual left‑to‑right flow we keep the nice smoothstep routing.
  if (targetX >= sourceX) {
    const [path] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    return <BaseEdge path={path} markerEnd={markerEnd} style={style} />;
  }

  // For backward / loop edges, route in a rectilinear "loop" above the nodes
  // so the line doesn't pass through the cards, even if that is a longer path.
  const verticalMargin = 120;
  const controlY = Math.min(sourceY, targetY) - verticalMargin;
  const horizontalMargin = 40;

  // Offset away from both nodes so the loop clearly sits "outside" the row:
  // - start a bit further out from the source node
  // - end a bit further out from the target node
  const offsetSourceX = sourceX + horizontalMargin;
  const offsetTargetX = targetX - horizontalMargin;

  // Build a path with straight segments:
  // source → sideways from source → straight up → straight across →
  // straight down near target → sideways into target.
  const path = [
    `M ${sourceX},${sourceY}`,
    `L ${offsetSourceX},${sourceY}`,
    `L ${offsetSourceX},${controlY}`,
    `L ${offsetTargetX},${controlY}`,
    `L ${offsetTargetX},${targetY}`,
    `L ${targetX},${targetY}`,
  ].join(' ');

  return <BaseEdge path={path} markerEnd={markerEnd} style={style} />;
}


