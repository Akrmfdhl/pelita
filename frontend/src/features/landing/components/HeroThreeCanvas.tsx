import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const HeroThreeCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 400;
    let height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 1000);
    camera.position.set(0, 0, 20);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xfff4e0, 0.8));

    const keyLight = new THREE.DirectionalLight(0xfff8ec, 3.0);
    keyLight.position.set(8, 16, 10);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xd0e0ff, 1.2);
    fillLight.position.set(-10, 6, 8);
    scene.add(fillLight);


    const rimL = new THREE.PointLight(0xBA3801, 2.0, 40);
    rimL.position.set(5, -6, 6);
    scene.add(rimL);

    const backL = new THREE.PointLight(0x4A69B3, 1.5, 35);
    backL.position.set(-5, 8, -8);
    scene.add(backL);

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xC9A050,
      roughness: 0.25,
      metalness: 0.88,
    });

    const darkBrassMat = new THREE.MeshStandardMaterial({
      color: 0xA07830,
      roughness: 0.4,
      metalness: 0.8,
    });

    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x2A2520,
      roughness: 0.3,
      metalness: 0.65,
    });

    const chainMat = new THREE.MeshStandardMaterial({
      color: 0xB89040,
      roughness: 0.3,
      metalness: 0.85,
    });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const BASE_Y = -5.0;

    const base1 = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.35, 2.0), baseMat);
    base1.position.y = BASE_Y;
    rootGroup.add(base1);

    const base2 = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.3, 1.6), baseMat);
    base2.position.y = BASE_Y + 0.325;
    rootGroup.add(base2);

    const base3 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.25, 1.3), baseMat);
    base3.position.y = BASE_Y + 0.6;
    rootGroup.add(base3);

    const brassRim = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.06, 1.85), brassMat);
    brassRim.position.y = BASE_Y + 0.175;
    rootGroup.add(brassRim);

    const PILLAR_BOTTOM = BASE_Y + 0.72;
    const PILLAR_HEIGHT = 6.0;
    const PILLAR_TOP = PILLAR_BOTTOM + PILLAR_HEIGHT;

    const pillarGeo = new THREE.CylinderGeometry(0.18, 0.22, PILLAR_HEIGHT, 32);
    const pillar = new THREE.Mesh(pillarGeo, brassMat);
    pillar.position.y = PILLAR_BOTTOM + PILLAR_HEIGHT / 2;
    rootGroup.add(pillar);

    const addCollar = (y: number, r: number) => {
      const collar = new THREE.Mesh(new THREE.TorusGeometry(r, 0.065, 12, 32), darkBrassMat);
      collar.rotation.x = Math.PI / 2;
      collar.position.y = y;
      rootGroup.add(collar);
    };

    addCollar(PILLAR_BOTTOM + 0.3, 0.28);
    addCollar(PILLAR_BOTTOM + PILLAR_HEIGHT * 0.35, 0.26);
    addCollar(PILLAR_BOTTOM + PILLAR_HEIGHT * 0.55, 0.26);
    addCollar(PILLAR_TOP - 0.3, 0.24);

    const fulcrum = new THREE.Mesh(new THREE.SphereGeometry(0.32, 32, 32), brassMat);
    fulcrum.position.y = PILLAR_TOP + 0.1;
    rootGroup.add(fulcrum);

    const spireGroup = new THREE.Group();
    spireGroup.position.y = PILLAR_TOP + 0.4;
    const spireH = 1.0;
    const spireSegs = 48;
    for (let strand = 0; strand < 2; strand++) {
      const pts: THREE.Vector3[] = [];
      const offset = strand * Math.PI;
      for (let i = 0; i <= spireSegs; i++) {
        const t = i / spireSegs;
        const angle = t * 2.5 * Math.PI * 2 + offset;
        const r = 0.15 * (1 - t * 0.6);
        pts.push(new THREE.Vector3(Math.cos(angle) * r, t * spireH, Math.sin(angle) * r));
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      spireGroup.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.035, 8, false), brassMat));
    }
    const spireTip = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), brassMat);
    spireTip.position.y = spireH;
    spireGroup.add(spireTip);
    rootGroup.add(spireGroup);

    const BEAM_Y = PILLAR_TOP + 0.1;
    const BEAM_HALF = 3.2;
    const BEAM_ARC = 0.4;

    const beamGroup = new THREE.Group();
    beamGroup.position.y = BEAM_Y;

    const beamPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const x = (t - 0.5) * BEAM_HALF * 2;
      const y = Math.sin(t * Math.PI) * BEAM_ARC;
      beamPts.push(new THREE.Vector3(x, y, 0));
    }
    const beamCurve = new THREE.CatmullRomCurve3(beamPts);
    beamGroup.add(new THREE.Mesh(new THREE.TubeGeometry(beamCurve, 40, 0.08, 12, false), brassMat));

    const hookRadius = 0.14;
    const makeHook = (x: number) => {
      const hook = new THREE.Mesh(
        new THREE.TorusGeometry(hookRadius, 0.03, 8, 16, Math.PI * 1.3),
        darkBrassMat,
      );
      hook.position.set(x, -0.05, 0);
      hook.rotation.z = Math.PI * 0.85;
      beamGroup.add(hook);
    };
    makeHook(-BEAM_HALF);
    makeHook(BEAM_HALF);

    rootGroup.add(beamGroup);

    const CHAIN_TOP_Y = BEAM_Y - 0.15;
    const PAN_Y = BEAM_Y - 3.2;

    const makeBowl = (): THREE.Group => {
      const bowlGroup = new THREE.Group();

      const bowlOuter = new THREE.Mesh(
        new THREE.SphereGeometry(0.85, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.45),
        brassMat,
      );
      bowlOuter.rotation.x = Math.PI;
      bowlGroup.add(bowlOuter);

      const bowlInner = new THREE.Mesh(
        new THREE.SphereGeometry(0.78, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.42),
        darkBrassMat,
      );
      bowlInner.rotation.x = Math.PI;
      bowlInner.position.y = 0.04;
      bowlGroup.add(bowlInner);

      const rimGeo = new THREE.TorusGeometry(0.84, 0.05, 10, 48);
      const rim = new THREE.Mesh(rimGeo, brassMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.02;
      bowlGroup.add(rim);

      return bowlGroup;
    };

    const makeChains = (centerX: number, topY: number, bottomY: number, bowlRadius: number): THREE.Group => {
      const chainsGroup = new THREE.Group();
      const chainCount = 3;

      for (let i = 0; i < chainCount; i++) {
        const angle = (i / chainCount) * Math.PI * 2 - Math.PI / 2;
        const bottomX = centerX + Math.cos(angle) * (bowlRadius * 0.8);
        const bottomZ = Math.sin(angle) * (bowlRadius * 0.8);

        const top = new THREE.Vector3(centerX, topY, 0);
        const bot = new THREE.Vector3(bottomX, bottomY + 0.05, bottomZ);

        const mid = new THREE.Vector3(
          (top.x + bot.x) / 2,
          (top.y + bot.y) / 2 - 0.1,
          (top.z + bot.z) / 2,
        );

        const chainCurve = new THREE.CatmullRomCurve3([top, mid, bot]);
        const chainTube = new THREE.TubeGeometry(chainCurve, 16, 0.022, 6, false);
        chainsGroup.add(new THREE.Mesh(chainTube, chainMat));
      }

      return chainsGroup;
    };

    const leftPanGroup = new THREE.Group();
    const leftBowl = makeBowl();
    leftBowl.position.set(-BEAM_HALF, PAN_Y, 0);
    leftPanGroup.add(leftBowl);
    leftPanGroup.add(makeChains(-BEAM_HALF, CHAIN_TOP_Y, PAN_Y, 0.85));
    rootGroup.add(leftPanGroup);

    const rightPanGroup = new THREE.Group();
    const rightBowl = makeBowl();
    rightBowl.position.set(BEAM_HALF, PAN_Y, 0);
    rightPanGroup.add(rightBowl);
    rightPanGroup.add(makeChains(BEAM_HALF, CHAIN_TOP_Y, PAN_Y, 0.85));
    rootGroup.add(rightPanGroup);

    const totalBottom = BASE_Y - 0.175;
    const totalTop = PILLAR_TOP + 0.4 + spireH;
    const visualCenter = (totalBottom + totalTop) / 2;
    rootGroup.position.y = -visualCenter;

    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let targetRotX = -0.05;
    let targetRotY = 0.2;

    const onDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouse = { x: cx, y: cy };
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
      if (isDragging) {
        targetRotY += (cx - prevMouse.x) * 0.006;
        targetRotX += (cy - prevMouse.y) * 0.006;
        prevMouse = { x: cx, y: cy };
      } else {
        const rect = container.getBoundingClientRect();
        targetRotY = ((cx - rect.left - rect.width / 2) / rect.width) * 0.4;
        targetRotX = -((cy - rect.top - rect.height / 2) / rect.height) * 0.25 - 0.05;
      }
    };

    const onUp = () => { isDragging = false; };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onDown);
    dom.addEventListener('touchstart', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);

    const onResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      rootGroup.rotation.y += (targetRotY - rootGroup.rotation.y) * 0.05;
      rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * 0.05;

      const sway = Math.sin(t * 1.5) * 0.035;
      beamGroup.rotation.z = sway;
      leftPanGroup.position.y = Math.sin(t * 1.5) * 0.1;
      rightPanGroup.position.y = -Math.sin(t * 1.5) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      dom.removeEventListener('mousedown', onDown);
      dom.removeEventListener('touchstart', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) container.removeChild(renderer.domElement);
      brassMat.dispose();
      darkBrassMat.dispose();
      baseMat.dispose();
      chainMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[380px] sm:min-h-[460px] flex items-center justify-center relative cursor-grab active:cursor-grabbing select-none"
      aria-label="Neraca Keadilan Interaktif 3D"
    />
  );
};
