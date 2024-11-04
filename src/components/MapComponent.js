// import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// const MapComponent = ({ isSidebarOpen, attackSpeed, setCountryData, onCountryClick }) => {
//   const mapRef = useRef(null); // Store the Leaflet map instance

//   useEffect(() => {
//     const map = L.map('map', {
//       zoomControl: false,
//       scrollWheelZoom: false,
//       doubleClickZoom: false,
//       dragging: false,
//       attributionControl: false,
//       maxBounds: [[-90, -180], [90, 180]],
//       maxBoundsViscosity: 1.0,
//     }).setView([40, 0], 1.5);

//     mapRef.current = map; // Store map instance

//     // Add background rectangle to map
//     L.rectangle([[-90, -180], [90, 180]], {
//       color: '#000000',
//       fillColor: '#000000',
//       fillOpacity: 1,
//     }).addTo(map);

//     // Load GeoJSON for countries
//     fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
//       .then((response) => response.json())
//       .then((data) => {
//         const geoJsonLayer = L.geoJSON(data, {
//           style: {
//             color: '#4A90E2',
//             weight: 0.5,
//             fillColor: '#000000',
//             fillOpacity: 0.5,
//           },
//           onEachFeature: function (feature, layer) {
//             layer.on({
//               mouseover: function () {
//                 layer.setStyle({
//                   color: '#4A90E2',
//                   weight: 1.5,
//                   dashArray: '5, 5',
//                   fillColor: '#4A90E2',
//                   fillOpacity: 0.5,
//                 });
//               },
//               mouseout: function () {
//                 layer.setStyle({
//                   color: '#4A90E2',
//                   weight: 0.5,
//                   dashArray: '',
//                   fillColor: '#000000',
//                   fillOpacity: 0.5,
//                 });
//               },
//               click: function () {
//                 const countryName = feature.properties.ADMIN; // Get country name
//                 fetch('/countrySeparateData.json')
//                   .then((response) => response.json())
//                   .then((data) => {
//                     const selectedCountryData = data[countryName];
//                     setCountryData(selectedCountryData);
//                     if (onCountryClick) {
//                       onCountryClick(selectedCountryData); // Pass data to parent
//                     }
//                   });
//               },
//             });
//           },
//         }).addTo(map);
//       });

//     const svgLayer = d3.select(map.getPanes().overlayPane).append('svg'),
//       g = svgLayer.append('g').attr('class', 'leaflet-zoom-hide');

//     let currentIndex = 0;

    // function projectPoint(latlng) {
    //   const point = map.latLngToLayerPoint(new L.LatLng(latlng[0], latlng[1]));
    //   return [point.x, point.y];
    // }

    // function createGradient(id, color) {
    //   const svgDefs = svgLayer.append('defs');

    //   const radialGradient = svgDefs.append('radialGradient')
    //     .attr('id', id)
    //     .attr('cx', '50%')
    //     .attr('cy', '50%')
    //     .attr('r', '50%');

    //   radialGradient.append('stop')
    //     .attr('offset', '0%')
    //     .attr('stop-color', color)
    //     .attr('stop-opacity', 1);

    //   radialGradient.append('stop')
    //     .attr('offset', '100%')
    //     .attr('stop-color', color)
    //     .attr('stop-opacity', 0);
    // }

    // function showNextAttack(attackData) {
    //   if (currentIndex >= attackData.length) {
    //     currentIndex = 0;
    //   }

    //   const attack = attackData[currentIndex++];
    //   const source = projectPoint(attack.source);
    //   const destination = projectPoint(attack.destination);

    //   const midPoint = [
    //     (source[0] + destination[0]) / 2 + 100,
    //     (source[1] + destination[1]) / 2,
    //   ];

    //   let lineColor;
    //   switch (attack.threatType) {
    //     case 'malware':
    //       lineColor = 'red';
    //       break;
    //     case 'phishing':
    //       lineColor = 'purple';
    //       break;
    //     case 'exploit':
    //       lineColor = 'yellow';
    //       break;
    //     default:
    //       lineColor = 'white';
    //   }

    //   const lineGenerator = d3.line()
    //     .curve(d3.curveBundle.beta(1))
    //     .x((d) => d[0])
    //     .y((d) => d[1]);

    //   g.append('path')
    //     .datum([source, midPoint, destination])
    //     .attr('class', 'attack-line')
    //     .attr('d', lineGenerator)
    //     .attr('stroke', lineColor)
    //     .attr('stroke-width', 2)
    //     .attr('stroke-dasharray', function () {
    //       return this.getTotalLength();
    //     })
    //     .attr('stroke-dashoffset', function () {
    //       return this.getTotalLength();
    //     })
    //     .transition()
    //     .duration(attackSpeed)
    //     .ease(d3.easeLinear)
    //     .attr('stroke-dashoffset', 0)
    //     .on('start', function () {
    //       const gradientId = `fadeGradient-${currentIndex}`;
    //       createGradient(gradientId, lineColor);
    //       g.append('circle')
    //         .attr('cx', source[0])
    //         .attr('cy', source[1])
    //         .attr('r', 5)
    //         .attr('fill', `url(#${gradientId})`)
    //         .attr('opacity', 0)
    //         .transition()
    //         .duration(1000)
    //         .ease(d3.easeBounceOut)
    //         .attr('r', 15)
    //         .attr('opacity', 1)
    //         .transition()
    //         .duration(500)
    //         .attr('r', 0)
    //         .attr('opacity', 0)
    //         .remove();
    //     })
    //     .on('end', function () {
    //       const gradientId = `fadeGradient-${currentIndex}-end`;
    //       createGradient(gradientId, lineColor);
    //       g.append('circle')
    //         .attr('cx', destination[0])
    //         .attr('cy', destination[1])
    //         .attr('r', 5)
    //         .attr('fill', `url(#${gradientId})`)
    //         .attr('opacity', 0)
    //         .transition()
    //         .duration(1000)
    //         .ease(d3.easeBounceOut)
    //         .attr('r', 15)
    //         .attr('opacity', 1)
    //         .transition()
    //         .duration(500)
    //         .attr('r', 0)
    //         .attr('opacity', 0)
    //         .remove();
    //       d3.select(this)
    //         .transition()
    //         .duration(2000)
    //         .ease(d3.easeLinear)
    //         .attr('stroke-dashoffset', -this.getTotalLength())
    //         .remove();

    //       showNextAttack(attackData);
    //     });

    //   const attackInfo = `${attack.sourceName} ➔ ${attack.destinationName} (${attack.threatType})`;
    //   d3.select('#activeAttacksList').append('li').text(attackInfo).transition().duration(attackSpeed).remove();
    // }

    // function reset(attackData) {
    //   const bounds = map.getBounds(),
    //     topLeft = map.latLngToLayerPoint(bounds.getNorthWest()),
    //     bottomRight = map.latLngToLayerPoint(bounds.getSouthEast());

    //   svgLayer
    //     .attr('width', bottomRight.x - topLeft.x)
    //     .attr('height', bottomRight.y - topLeft.y)
    //     .style('left', `${topLeft.x}px`)
    //     .style('top', `${topLeft.y}px`);

    //   g.attr('transform', `translate(${-topLeft.x}, ${-topLeft.y})`);

    //   showNextAttack(attackData);
    // }

    // fetch('/attackData.json')
    //   .then((response) => response.json())
    //   .then((attackData) => {
    //     map.on('moveend', () => reset(attackData));
    //     reset(attackData);
    //   });

//     return () => {
//       map.off('moveend');
//       map.remove();
//     };
//   }, [attackSpeed, onCountryClick]); // Make sure to include 'setCountryData' if necessary

//   // Adjust map size on sidebar toggle
//   useEffect(() => {
//     if (mapRef.current) {
//       setTimeout(() => {
//         mapRef.current.invalidateSize();
//       }, 400);
//     }
//   }, [isSidebarOpen]);

//   return (
//     <div id="map" style={{ height: '100vh', width: '100%' }} />
//   );
// };

// export default MapComponent;
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const MapComponent = ({ isSidebarOpen, attackSpeed, setCountryData, onCountryClick }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

  
    const globeGeometry = new THREE.SphereGeometry(1, 64, 64);
    const globeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: new THREE.Color(0x000000) },
        color2: { value: new THREE.Color(0x4A90E2) }, 
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(mix(color1, color2, intensity), 1.0);
        }
      `,
    });
    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globeMesh);

    
    camera.position.z = 2.5;

    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.minDistance = 1.5;
    controls.maxDistance = 5;

    // Load GeoJSON and add black country outlines to the globe
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
      .then((response) => response.json())
      .then((data) => {
        const countryMaterial = new THREE.LineBasicMaterial({ color: 0x4A90E2 });

        data.features.forEach((feature) => {
          const coordinates = feature.geometry.coordinates;

          coordinates.forEach((polygon) => {
            const points = polygon[0].map((coord) => {
              const [lon, lat] = coord;
              const { x, y, z } = latLonToVector3(lat, lon);
              return new THREE.Vector3(x, y, z);
            });

            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(lineGeometry, countryMaterial);
            globeMesh.add(line); 
          });
        });
      });

   
    function latLonToVector3(lat, lon, radius = 1) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return {
        x: -(radius * Math.sin(phi) * Math.cos(theta)),
        y: radius * Math.cos(phi),
        z: radius * Math.sin(phi) * Math.sin(theta),
      };
    }


    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.005,
      transparent: true,
      opacity: 0.8,
    });

   
    const starVertices = [];
    for (let i = 0; i < 1500; i++) {
      const x = THREE.MathUtils.randFloatSpread(10);
      const y = THREE.MathUtils.randFloatSpread(10);
      const z = THREE.MathUtils.randFloatSpread(10);
      if (Math.abs(z) > 2) { 
        starVertices.push(x, y, z);
      }
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    
    const animate = () => {
      requestAnimationFrame(animate);
      globeMesh.rotation.y += 0.005; 
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [attackSpeed]);

  return <div ref={mountRef} style={{ height: '100vh', width: '100%' }} />;
};

export default MapComponent;
