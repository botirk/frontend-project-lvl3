import axios from 'axios';

const parser = new DOMParser();

const generateItem = (itemEl) => {
  const itemChildren = Array.from(itemEl.children);
  const result = {
    title: itemChildren.find((el) => el.tagName === 'title').textContent,
    description: itemChildren.find((el) => el.tagName === 'description').textContent,
    date: new Date(itemChildren.find((el) => el.tagName === 'pubDate').textContent),
    link: itemChildren.find((el) => el.tagName === 'link').textContent,
  };
  result.hash = () => `${result.date}${result.link}`;
  return result;
};

const parseRSS = (link, text) => {
  const xml = parser.parseFromString(text, 'application/xml');
  // console.log(xml);

  const { documentElement } = xml;
  if (documentElement.tagName !== 'rss') throw new Error(`documentElement.tagName: ${documentElement.tagName}`);
  const channel = documentElement.firstElementChild;
  if (channel.tagName !== 'channel') throw new Error(`documentElement.firstElementChild: ${channel.tagName}`);
  const channelChildren = Array.from(channel.children);

  const title = channelChildren.find((el) => el.tagName === 'title').textContent;
  const description = channelChildren.find((el) => el.tagName === 'description').textContent;
  const items = channelChildren.filter((el) => el.tagName === 'item').map(generateItem);

  const result = {
    link,
    title,
    description,
    items,
  };
  return result;
};

export default (link) => axios(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(link)}&disableCache=true`)
  .then((resp) => {
    const { status, contents } = resp.data;
    if (status !== undefined && status.error !== undefined) throw new Error(status.error.code);
    return parseRSS(link, contents);
  });
