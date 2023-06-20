"use client";

import MeshaCore from "../mesha-core/MeshaCore";
import { useEffect } from "react";

export default function Home() {
  const initializeMeshaCore = () => {
    const canvas = document.getElementById("demoCanvas") as HTMLCanvasElement;
    const meshaCore = new MeshaCore();
    meshaCore.initialize(canvas);
  };

  useEffect(() => {
    initializeMeshaCore();
  }, []);

  return (
    <div>
      <h1>MeshaCore Research Demo</h1>
      <canvas id="demoCanvas" width="800" height="600"></canvas>
    </div>
  );
}
