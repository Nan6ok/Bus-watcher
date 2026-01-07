mapboxgl.accessToken='pk.eyJ1IjoibmFuNm9rIiwiYSI6ImNtazB2bTYxMTdhNnkzZHB1cXN4bTRmb3UifQ.c6BNgPAE-3qtewe22CGvyQ';
const map = new mapboxgl.Map({
  container:'map',
  style:'mapbox://styles/mapbox/light-v11',
  center:[114.157,22.285],
  zoom:14,
  pitch:60,
  bearing:-17,
  antialias:true
});

map.on('load',()=>{
  initThreeLayer(map);

  // 初始化巴士
  addBus3D('KMB-1','kmb',114.157,22.285);
  addBus3D('CTB-2','ctb',114.158,22.284);
  addBus3D('NLB-3','nlb',114.156,22.284);
});

// 切換地圖風格
document.getElementById('mapStyleBtn').addEventListener('click',()=>{
  const current = map.getStyle().name;
  if(current==='Mapbox Light') map.setStyle('mapbox://styles/mapbox/dark-v11');
  else map.setStyle('mapbox://styles/mapbox/light-v11');
});
