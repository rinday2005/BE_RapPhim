// Movies data for backend - can be used for seeding or API responses
export const moviesData = [
  {
    movieId: 'M001',
    title: 'Avengers: Endgame',
    description: 'Sau khi Thanos thực hiện Snap và tiêu diệt một nửa vũ trụ, các siêu anh hùng còn lại phải đoàn kết để đảo ngược tình thế và cứu lấy vũ trụ. Đây là phần cuối của câu chuyện Avengers với những trận chiến hoành tráng và cảm xúc sâu sắc.',
    duration: 181,
    releaseDate: new Date('2023-04-26'),
    language: 'Tiếng Anh - Phụ đề Việt',
    rating: 'C13',
    genre: ['Hành động', 'Phiêu lưu', 'Khoa học viễn tưởng'],
    poster: '/images/z0gRHPKq0uX2YY5YqKRLiRCoBqN.webp',
    trailer: 'https://youtube.com/watch?v=TcMBFSGVi1c',
    director: 'Anthony Russo, Joe Russo',
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Chris Hemsworth'],
    imdbRating: 8.4,
    isHot: true,
    isComingSoon: false,
    status: 'showing',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    movieId: 'M002',
    title: 'Spider-Man: No Way Home',
    description: 'Peter Parker phải đối mặt với những hậu quả khi danh tính bí mật của anh bị tiết lộ và phải tìm cách khôi phục lại cuộc sống bình thường. Với sự xuất hiện của các Spider-Man từ vũ trụ khác, cuộc phiêu lưu trở nên phức tạp hơn bao giờ hết.',
    duration: 148,
    releaseDate: new Date('2023-12-17'),
    language: 'Tiếng Anh - Phụ đề Việt',
    rating: 'C13',
    genre: ['Hành động', 'Siêu anh hùng', 'Phiêu lưu'],
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=450&fit=crop',
    trailer: 'https://youtube.com/watch?v=JfVOs4VSpmA',
    director: 'Jon Watts',
    cast: ['Tom Holland', 'Zendaya', 'Benedict Cumberbatch', 'Jacob Batalon'],
    imdbRating: 8.2,
    isHot: true,
    isComingSoon: false,
    status: 'showing',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    movieId: 'M003',
    title: 'Dune',
    description: 'Câu chuyện về Paul Atreides, một thanh niên tài năng phải đối mặt với những thử thách khốc liệt trên hành tinh sa mạc Arrakis. Đây là một tác phẩm khoa học viễn tưởng hoành tráng với hình ảnh đẹp mắt và cốt truyện sâu sắc.',
    duration: 155,
    releaseDate: new Date('2023-10-22'),
    language: 'Tiếng Anh - Phụ đề Việt',
    rating: 'C13',
    genre: ['Khoa học viễn tưởng', 'Phiêu lưu', 'Drama'],
    poster: '/images/dune__part_two_poster_2__updated_release_date__by_paramountj_dg6v4iy-fullview.jpg',
    trailer: 'https://youtube.com/watch?v=n9xhJrPXop4',
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Rebecca Ferguson', 'Oscar Isaac', 'Josh Brolin'],
    imdbRating: 8.0,
    isHot: false,
    isComingSoon: false,
    status: 'showing',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    movieId: 'M004',
    title: 'The Batman',
    description: 'Khi một kẻ giết người hàng loạt bắt đầu tấn công các quan chức cấp cao của Gotham, Batman phải điều tra để tìm ra danh tính của kẻ thù. Đây là phiên bản tối tăm và chân thực nhất của Batman với Robert Pattinson trong vai chính.',
    duration: 176,
    releaseDate: new Date('2024-03-04'),
    language: 'Tiếng Anh - Phụ đề Việt',
    rating: 'C16',
    genre: ['Hành động', 'Tội phạm', 'Drama'],
    poster: 'https://images.unsplash.com/photo-1644982647844-5f1b8241205f?w=300&h=450&fit=crop',
    trailer: 'https://youtube.com/watch?v=mqqft2x_Aa4',
    director: 'Matt Reeves',
    cast: ['Robert Pattinson', 'Zoë Kravitz', 'Paul Dano', 'Jeffrey Wright'],
    imdbRating: 7.8,
    isHot: false,
    isComingSoon: true,
    status: 'coming_soon',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    movieId: 'M005',
    title: 'Top Gun: Maverick',
    description: 'Sau hơn 30 năm phục vụ, Maverick vẫn là một trong những phi công giỏi nhất của Hải quân Hoa Kỳ, nhưng phải đối mặt với những thử thách mới. Với những cảnh bay hoành tráng và câu chuyện cảm động, đây là một tác phẩm điện ảnh đáng xem.',
    duration: 131,
    releaseDate: new Date('2024-05-27'),
    language: 'Tiếng Anh - Phụ đề Việt',
    rating: 'C13',
    genre: ['Hành động', 'Drama'],
    poster: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=450&fit=crop',
    trailer: 'https://youtube.com/watch?v=qSqVVswa420',
    director: 'Joseph Kosinski',
    cast: ['Tom Cruise', 'Miles Teller', 'Jennifer Connelly', 'Jon Hamm'],
    imdbRating: 8.3,
    isHot: false,
    isComingSoon: true,
    status: 'coming_soon',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Helper functions for backend
export const getMovieById = (movieId) => {
  return moviesData.find(movie => movie.movieId === movieId);
};

export const getHotMovies = () => {
  return moviesData.filter(movie => movie.isHot);
};

export const getComingSoonMovies = () => {
  return moviesData.filter(movie => movie.isComingSoon);
};

export const getShowingMovies = () => {
  return moviesData.filter(movie => movie.status === 'showing');
};

export const getMoviesByGenre = (genre) => {
  return moviesData.filter(movie => movie.genre.includes(genre));
};

export const searchMovies = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return moviesData.filter(movie => 
    movie.title.toLowerCase().includes(lowercaseQuery) ||
    movie.director.toLowerCase().includes(lowercaseQuery) ||
    movie.cast.some(actor => actor.toLowerCase().includes(lowercaseQuery)) ||
    movie.genre.some(g => g.toLowerCase().includes(lowercaseQuery))
  );
};

export const createMovie = (movieData) => {
  const newMovie = {
    movieId: `M${String(moviesData.length + 1).padStart(3, '0')}`,
    ...movieData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  moviesData.push(newMovie);
  return newMovie;
};

export const updateMovie = (movieId, updateData) => {
  const index = moviesData.findIndex(movie => movie.movieId === movieId);
  if (index !== -1) {
    moviesData[index] = {
      ...moviesData[index],
      ...updateData,
      updatedAt: new Date()
    };
    return moviesData[index];
  }
  return null;
};

export const deleteMovie = (movieId) => {
  const index = moviesData.findIndex(movie => movie.movieId === movieId);
  if (index !== -1) {
    return moviesData.splice(index, 1)[0];
  }
  return null;
};