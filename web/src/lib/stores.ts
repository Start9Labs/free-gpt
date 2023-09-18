import { writable, type Writable } from "svelte/store";

const themeStore = writable("dark");

const barVisible = writable(true);

const cpus = writable(8)

const modelsUrl = writable("https://raw.githubusercontent.com/serge-chat/serge/main/api/src/serge/data/models.json")

const newChat: Writable<object | null> = writable(null);

export { barVisible, newChat, themeStore, cpus, modelsUrl };
