import Axios from "axios";
import { ARTICLES_API } from "../../config";
import Cache from "./cache";

async function findAll() {
  const cachedArticles = await Cache.get("articles");
  if (cachedArticles) return cachedArticles;
  return Axios.get(ARTICLES_API).then((response) => {
    const articles = response.data["hydra:member"];
    Cache.set("articles", articles);
    return articles;
  });
}

function find(id) {
  return Axios.get(ARTICLES_API + "/" + id).then((response) => response.data);
}

function findOtherData() {
  return Axios.get("https://api-sta2.herokuapp.com/article").then(
    (response) => response.data
  );
}

function deleteArticle(id) {
  return Axios.delete(ARTICLES_API + "/" + id);
}

function update(id, article) {
  return Axios.put(ARTICLES_API + "/" + id, article);
}

function create(article) {
  return Axios.post(ARTICLES_API, article);
}

export default {
  findAll,
  find,
  create,
  update,
  delete: deleteArticle,
  findOtherData,
};
