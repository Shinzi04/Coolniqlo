const searchItems = async (query) => {
  try {
    const response = await fetch(`/search?q=${query}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

module.exports = searchItems;
