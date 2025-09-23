// Cinema system data for backend
export const cinemaSystemData = [
  {
    systemId: 'SYS001',
    name: 'CGV Cinemas',
    logo: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=100&h=50&fit=crop',
    address: 'Hệ thống rạp chiếu phim CGV',
    website: 'https://cgv.vn',
    phone: '1900 6017',
    description: 'Hệ thống rạp chiếu phim hàng đầu Việt Nam với công nghệ hiện đại',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    systemId: 'SYS002',
    name: 'Lotte Cinema',
    logo: 'https://images.unsplash.com/photo-1489599805359-8b5a2a2b5b5b?w=100&h=50&fit=crop',
    address: 'Hệ thống rạp chiếu phim Lotte',
    website: 'https://lottecinemavn.com',
    phone: '1900 2224',
    description: 'Rạp chiếu phim chất lượng cao với không gian sang trọng',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    systemId: 'SYS003',
    name: 'Galaxy Cinema',
    logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=50&fit=crop',
    address: 'Hệ thống rạp chiếu phim Galaxy',
    website: 'https://galaxycine.vn',
    phone: '1900 2224',
    description: 'Rạp chiếu phim với giá vé hợp lý và chất lượng tốt',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const cinemaClusterData = [
  {
    clusterId: 'CLU001',
    systemId: 'SYS001',
    name: 'CGV Vincom Center',
    address: '72 Lê Thánh Tôn, Quận 1, TP.HCM',
    phone: '028 3822 8888',
    facilities: ['IMAX', '4DX', 'STARIUM', 'GOLD CLASS'],
    parking: true,
    foodCourt: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    clusterId: 'CLU002',
    systemId: 'SYS001',
    name: 'CGV Landmark 81',
    address: '208 Nguyễn Hữu Cảnh, Quận Bình Thạnh, TP.HCM',
    phone: '028 3822 8888',
    facilities: ['IMAX', '4DX', 'STARIUM'],
    parking: true,
    foodCourt: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    clusterId: 'CLU003',
    systemId: 'SYS002',
    name: 'Lotte Cinema Diamond Plaza',
    address: '34 Lê Duẩn, Quận 1, TP.HCM',
    phone: '028 3822 8888',
    facilities: ['DOLBY ATMOS', 'GOLD CLASS'],
    parking: true,
    foodCourt: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    clusterId: 'CLU004',
    systemId: 'SYS002',
    name: 'Lotte Cinema Cantavil',
    address: '1 Sư Vạn Hạnh, Quận 10, TP.HCM',
    phone: '028 3822 8888',
    facilities: ['DOLBY ATMOS'],
    parking: true,
    foodCourt: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    clusterId: 'CLU005',
    systemId: 'SYS003',
    name: 'Galaxy Cinema Nguyễn Du',
    address: '116 Nguyễn Du, Quận 1, TP.HCM',
    phone: '028 3822 8888',
    facilities: ['STANDARD'],
    parking: false,
    foodCourt: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const theaterData = [
  {
    hallId: 'H001',
    clusterId: 'CLU001',
    name: 'Phòng 1 - IMAX',
    capacity: 300,
    screenType: 'IMAX',
    soundSystem: 'Dolby Atmos',
    seatLayout: {
      rows: 15,
      seatsPerRow: 20,
      vipRows: [13, 14, 15],
      coupleSeats: ['H13-14', 'H15-16']
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    hallId: 'H002',
    clusterId: 'CLU001',
    name: 'Phòng 2 - 4DX',
    capacity: 120,
    screenType: '4DX',
    soundSystem: 'Dolby Atmos',
    seatLayout: {
      rows: 10,
      seatsPerRow: 12,
      vipRows: [8, 9, 10],
      coupleSeats: []
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    hallId: 'H003',
    clusterId: 'CLU001',
    name: 'Phòng 3 - Standard',
    capacity: 200,
    screenType: 'Standard',
    soundSystem: 'Dolby Digital',
    seatLayout: {
      rows: 12,
      seatsPerRow: 17,
      vipRows: [10, 11, 12],
      coupleSeats: []
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    hallId: 'H004',
    clusterId: 'CLU002',
    name: 'Phòng 1 - IMAX',
    capacity: 350,
    screenType: 'IMAX',
    soundSystem: 'Dolby Atmos',
    seatLayout: {
      rows: 18,
      seatsPerRow: 20,
      vipRows: [15, 16, 17, 18],
      coupleSeats: ['H15-16', 'H17-18']
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    hallId: 'H005',
    clusterId: 'CLU003',
    name: 'Phòng 1 - Gold Class',
    capacity: 80,
    screenType: 'Gold Class',
    soundSystem: 'Dolby Atmos',
    seatLayout: {
      rows: 8,
      seatsPerRow: 10,
      vipRows: [6, 7, 8],
      coupleSeats: ['H6-7', 'H8-9']
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Helper functions for backend
export const getCinemaSystemById = (systemId) => {
  return cinemaSystemData.find(system => system.systemId === systemId);
};

export const getClustersBySystem = (systemId) => {
  return cinemaClusterData.filter(cluster => cluster.systemId === systemId);
};

export const getTheatersByCluster = (clusterId) => {
  return theaterData.filter(theater => theater.clusterId === clusterId);
};

export const getActiveCinemaSystems = () => {
  return cinemaSystemData.filter(system => system.isActive);
};

export const getActiveClusters = () => {
  return cinemaClusterData.filter(cluster => cluster.isActive);
};

export const getActiveTheaters = () => {
  return theaterData.filter(theater => theater.isActive);
};

export const createCinemaSystem = (systemData) => {
  const newSystem = {
    systemId: `SYS${String(cinemaSystemData.length + 1).padStart(3, '0')}`,
    ...systemData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  cinemaSystemData.push(newSystem);
  return newSystem;
};

export const createCinemaCluster = (clusterData) => {
  const newCluster = {
    clusterId: `CLU${String(cinemaClusterData.length + 1).padStart(3, '0')}`,
    ...clusterData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  cinemaClusterData.push(newCluster);
  return newCluster;
};

export const createTheater = (theaterData) => {
  const newTheater = {
    hallId: `H${String(theaterData.length + 1).padStart(3, '0')}`,
    ...theaterData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  theaterData.push(newTheater);
  return newTheater;
};
