let threeScene, threeCamera, threeRenderer;
const Bus3DMarkers = {}; // busKey -> THREE.Mesh

// 範例巴士路線
const routes = {
  kmb:[{lng:114.157,lat:22.285},{lng:114.158,lat:22.286},{lng:114.159,lat:22.287}],
  ctb:[{lng:114.158,lat:22.284},{lng:114.159,lat:22.285},{lng:114.16,lat:22.286}],
  nlb:[{lng:114.156,lat:22.284},{lng:114.157,lat:22.283},{lng:114.158,lat:22.284}]
};

// 初始化 Three.js Layer
function initThreeLayer(map){
  threeScene = new THREE.Scene();
  threeCamera = new THREE.PerspectiveCamera();

  map.addLayer({
    id:'3d-bus-layer',
    type:'custom',
    renderingMode:'3d',
    onAdd:function(map,gl){
      threeRenderer = new THREE.WebGLRenderer({
        canvas: map.getCanvas(), context:gl, antialias:true
      });
      threeRenderer.autoClear=false;
    },
    render:function(gl,matrix){
      const m = new THREE.Matrix4().fromArray(matrix);
      threeCamera.projectionMatrix = m;
      threeRenderer.state.reset();
      threeRenderer.render(threeScene, threeCamera);
      map.triggerRepaint();
    }
  });
}

// 生成 3D 巴士（方塊）
function addBus3D(busKey, brand, lng, lat){
  if(Bus3DMarkers[busKey]) return;

  let color = 0xff0000; // KMB
  if(brand==='ctb') color=0xffff00;
  if(brand==='nlb') color=0x3399ff;

  const geometry = new THREE.BoxGeometry(0.0005,0.0002,0.0002);
  const material = new THREE.MeshStandardMaterial({color});
  const bus = new THREE.Mesh(geometry, material);

  const coords = mapboxgl.MercatorCoordinate.fromLngLat({lng,lat},0);
  bus.position.set(coords.x,coords.y,coords.z);

  Bus3DMarkers[busKey]=bus;
  threeScene.add(bus);
}

// 更新巴士位置（簡單自動移動）
function updateBuses(){
  const now = Date.now()/1000; // 秒
  Object.keys(Bus3DMarkers).forEach(busKey=>{
    let route;
    if(busKey.startsWith('KMB')) route=routes.kmb;
    if(busKey.startsWith('CTB')) route=routes.ctb;
    if(busKey.startsWith('NLB')) route=routes.nlb;
    if(!route) return;

    const t = (now%route.length);
    const p0 = route[Math.floor(t)];
    const p1 = route[(Math.floor(t)+1)%route.length];
    const ratio = t-Math.floor(t);
    const lng = p0.lng + (p1.lng-p0.lng)*ratio;
    const lat = p0.lat + (p1.lat-p0.lat)*ratio;
    const bus = Bus3DMarkers[busKey];
    const coords = mapboxgl.MercatorCoordinate.fromLngLat({lng,lat},0);
    bus.position.set(coords.x,coords.y,coords.z);
  });
}
setInterval(updateBuses,1000);
