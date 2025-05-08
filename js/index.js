const NUMBER_OF_ARTICLES = 5;

const getNewsGridElement = () => {
  const newsGrid = document.querySelector(".news-grid");
  if (!newsGrid) {
    console.error("News grid element not found.");
    return;
  }
  return newsGrid;
};

const clearNewsGrid = (gridElement) => {
  if (gridElement) {
    gridElement.innerHTML = "";
  }
};

const displayError = (message) => {
  const newsGrid = getNewsGridElement();
  if (newsGrid) {
    newsGrid.innerHTML = `<div class="loading-error">${message}</div>`;
  }
};

const createArticleInnerHTML = (article, index) => {
  const categoryText = article?.primarySectionRouteName || "Category";
  const linkHref = article?.link || "#";
  const imageSrc = article?.thumbnail?.src || "";
  const imageAlt = article?.thumbnail?.title || "Article image";
  const headlineText = article?.headline || "No Headline";
  const standfirstText = article?.standfirst || "";

  if (index % NUMBER_OF_ARTICLES === 0) {
    return `
            <a class="article-category" href="${linkHref}">${categoryText}</a>
            <a href="${linkHref}">
                <img src="${imageSrc}" alt="${imageAlt}" class="article-image">
            </a>
            <div class="article-content">
                <h4 class="article-title">
                    <a href="${linkHref}">
                        ${headlineText}
                    </a>
                </h4>
                <p class="article-standfirst">${standfirstText}</p>
            </div>
        `;
  } else {
    return `
            <a class="article-category" href="${linkHref}">${categoryText}</a>
            <h4 class="article-title">
                <a href="${linkHref}">
                    ${headlineText}
                </a>
            </h4>
            <div class="article-body-split">
                <a href="${linkHref}" class="article-image-link">
                    <img src="${imageSrc}" alt="${imageAlt}" class="article-image">
                </a>
                <p class="article-standfirst">${standfirstText}</p>
            </div>
        `;
  }
};

const buildArticleElement = (article, index) => {
  const articleElement = document.createElement("div");
  articleElement.classList.add("article");

  articleElement.setAttribute(
    "data-category",
    article.primarySectionRouteName || ""
  );

  if (index % NUMBER_OF_ARTICLES !== 0) {
    articleElement.classList.add("article-side-layout");
  }

  const articleHTML = createArticleInnerHTML(article, index);
  articleElement.innerHTML = articleHTML;

  return articleElement;
};

const appendArticleToGrid = (gridElement, articleElement) => {
  if (gridElement && articleElement) {
    gridElement.appendChild(articleElement);
  }
};

const renderArticles = (articles) => {
  const newsGrid = getNewsGridElement();
  if (!newsGrid) {
    return;
  }

  clearNewsGrid(newsGrid);

  articles.forEach((article, index) => {
    const articleElement = buildArticleElement(article, index);
    appendArticleToGrid(newsGrid, articleElement);
  });
};

const fetchAndHandleNewsData = () => {
  fetch("data/code-test.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `HTTP error ${response.status}: ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.articles.length > 0) {
        renderArticles(data.articles);
      } else if (data && data.articles.length === 0) {
        console.warn("News data is valid but contains no articles.");
        displayError("No articles found.");
      } else {
        // Handle invalid data structure
        throw new Error("JSON data is not in the expected format.");
      }
    })
    .catch((error) => {
      console.error("Error: Loading JSON", error);
      displayError("Unable to load news");
    });
};

const init = () => {
  fetchAndHandleNewsData();
};

document.addEventListener("DOMContentLoaded", init);
