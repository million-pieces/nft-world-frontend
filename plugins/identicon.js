import Identicon from "identicon.js";

export default (ctx, inject) => {
  //generate a picture from the wallet address
  const identicon = (string) => `data:image/png;base64,${new Identicon(string, 420).toString()}`;

  ctx.$identicon = identicon;
  inject("identicon", identicon);
};
