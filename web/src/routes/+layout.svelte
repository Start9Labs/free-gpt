<script lang="ts">
  import "../app.css";
  import type { LayoutData } from "./$types";
  import { invalidate, goto } from "$app/navigation";
  import { onMount, onDestroy } from "svelte";
  import { page } from "$app/stores";
  import { barVisible, newChat, themeStore } from "$lib/stores.js";
  import { fly } from "svelte/transition";
  export let data: LayoutData;

  const isLoading = false;
  let deleteConfirm = false;
  let deleteAllConfirm = false;
  let theme: string;
  let bar_visible: boolean;
  let dataCht: Response | any = null;
  const unsubscribe = barVisible.subscribe((value) => (bar_visible = value));
  const unsubscribe1 = newChat.subscribe((value) => (dataCht = value));

  onMount(() => {
    bar_visible = window.innerWidth > 768;
    barVisible.set(bar_visible);
    theme = localStorage.getItem("data-theme") || "dark";
    document.documentElement.setAttribute("data-theme", theme);
  });

  $: id = $page.params.id || "";
  async function deleteChat(chatID: string) {
    const response = await fetch("/api/chat/" + chatID, { method: "DELETE" });
    if (response.status === 200) {
      toggleDeleteConfirm();
      await goto("/");
      await invalidate("/api/chat/");
    } else {
      console.error("Error " + response.status + ": " + response.statusText);
    }
  }

  async function deleteAllChat() {
    const response = await fetch("/api/chat/delete/all", { method: "DELETE" });
    if (response.status === 200) {
      toggleDeleteAllConfirm();
      await goto("/");
      await invalidate("/api/chat/");
    } else {
      console.error("Error " + response.status + ": " + response.statusText);
    }
  }

  function toggleDeleteConfirm() {
    deleteConfirm = !deleteConfirm;
  }

  function toggleDeleteAllConfirm() {
    deleteAllConfirm = !deleteAllConfirm;
  }

  function timeSince(datestring: string) {
    const date = new Date(datestring);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    let interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }

  function truncate(str: string, n: number) {
    return str.length > n ? str.slice(0, n - 1) + "..." : str;
  }

  function toggleTheme() {
    $themeStore = $themeStore === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", $themeStore);
    localStorage.setItem("data-theme", $themeStore);
  }

  function toggleBar() {
    bar_visible = !bar_visible;
    barVisible.set(bar_visible);
  }

  onDestroy(() => {
    unsubscribe;
    unsubscribe1;
  });
  // onDestroy(unsubscribe1);
</script>

<aside
  id="default-sidebar"
  class={"border-base-content/[.2] fixed left-0 top-0 z-40 h-screen w-80 -translate-x-full border-r transition-transform overflow-hidden" +
    (bar_visible ? " translate-x-0" : "")}
  aria-label="Sidebar"
>
  <div
    class="bg-base-200 relative h-screen py-1 px-2 overflow-hidden flex flex-col items-center justify-between"
  >
    <div
      class="w-full flex items-center justify-between border-b border-base-content/[.2] pb-1"
    >
      <button
        disabled={isLoading}
        class="btn btn-ghost h-6 w-4/5 justify-between font-semibold text-left text-sm capitalize"
        class:loading={isLoading}
        on:click|preventDefault={() => goto('/')}
      >
        <span>New chat</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="w-4 h-4"
        >
          <path
            d="M1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0 1 13.25 12H9.06l-2.573 2.573A1.458 1.458 0 0 1 4 13.543V12H2.75A1.75 1.75 0 0 1 1 10.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h4.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"
          >
          </path>
        </svg>
      </button>
      <button
        class="btn btn-ghost flex h-6 w-1/6 items-center justify-center font-semibold z-40"
        on:click={toggleBar}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-6 h-6"
        >
          <path
            d="M11.28 9.53 8.81 12l2.47 2.47a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215l-3-3a.75.75 0 0 1 0-1.06l3-3a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734Z"
          >
          </path>
          <path
            d="M3.75 2h16.5c.966 0 1.75.784 1.75 1.75v16.5A1.75 1.75 0 0 1 20.25 22H3.75A1.75 1.75 0 0 1 2 20.25V3.75C2 2.784 2.784 2 3.75 2ZM3.5 3.75v16.5c0 .138.112.25.25.25H15v-17H3.75a.25.25 0 0 0-.25.25Zm13 16.75h3.75a.25.25 0 0 0 .25-.25V3.75a.25.25 0 0 0-.25-.25H16.5Z"
          >
          </path>
        </svg>
      </button>
    </div>
    <ul
      class="my-1 w-full h-[85%] overflow-y-auto no-scrollbar firefox-no-scrollbar ie-edge-no-scrollbar"
    >
      {#each data.chats as chat (chat.id)}
        <li in:fly={{ x: -100, duration: 900 }}>
          <a
            href={"/chat/" + chat.id}
            class="group hover:from-base-100 hover:text-base-content flex items-center rounded-lg py-2 pl-2 text-base font-normal hover:bg-gradient-to-r hover:to-transparent"
            class:bg-base-300={id === chat.id}
          >
            <div class="flex w-full flex-col">
              <div class="flex w-full flex-col items-start justify-start">
                <div
                  class="relative flex w-full flex-row items-center justify-between"
                >
                  <div class="flex flex-col">
                    <p class="text-sm font-light">
                      {truncate(chat.subtitle, 42)}
                    </p>
                    <span class="text-xs font-semibold">{chat.model}</span>
                    <span class="text-xs"
                      >{timeSince(chat.created) + " ago"}</span
                    >
                  </div>
                  <div
                    class="absolute right-0 opacity-0 group-hover:opacity-100 transition"
                  >
                    <!-- {#if $page.params.id === chat.id} -->
                    {#if deleteConfirm}
                      <div class="flex flex-row items-center">
                        <button
                          name="confirm-delete"
                          class="btn-ghost btn-sm btn"
                          on:click|preventDefault={() => deleteChat(chat.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            width="16"
                            height="16"
                          >
                            <path
                              class="fill-base-content"
                              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm1.5 0a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm10.28-1.72-4.5 4.5a.75.75 0 0 1-1.06 0l-2-2a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018l1.47 1.47 3.97-3.97a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"
                            />
                          </svg>
                        </button>
                        <button
                          name="cancel-delete"
                          class="btn-ghost btn-sm btn"
                          on:click|preventDefault={toggleDeleteConfirm}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            width="16"
                            height="16"
                          >
                            <path
                              class="fill-base-content"
                              d="M2.344 2.343h-.001a8 8 0 0 1 11.314 11.314A8.002 8.002 0 0 1 .234 10.089a8 8 0 0 1 2.11-7.746Zm1.06 10.253a6.5 6.5 0 1 0 9.108-9.275 6.5 6.5 0 0 0-9.108 9.275ZM6.03 4.97 8 6.94l1.97-1.97a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l1.97 1.97a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-1.97 1.97a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L6.94 8 4.97 6.03a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018Z"
                            />
                          </svg>
                        </button>
                      </div>
                    {:else}
                      <button
                        class="btn-ghost btn-sm btn"
                        on:click|preventDefault={toggleDeleteConfirm}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          width="16"
                          height="16"
                        >
                          <path
                            class="fill-base-content"
                            d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.75 1.75 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z"
                          />
                        </svg>
                      </button>
                    {/if}
                    <!-- {/if} -->
                  </div>
                </div>
              </div>
            </div>
          </a>
        </li>
      {/each}
    </ul>
    <div class="w-full border-t border-base-content/[.2] pt-1">
      {#if deleteAllConfirm}
        <button
          class="btn btn-ghost w-full flex flex-row justify-between items-center p-2.5 text-left text-sm capitalize"
        >
          <div class="h-6 flex flex-row items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              width="18"
              height="18"
              fill="currentColor"
              class="mr-3"
            >
              <path
                d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.75 1.75 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z"
              >
              </path>
            </svg>
            <span>Clear Chats</span>
          </div>
          <div class="h-6 flex flex-row items-center">
            <button
              name="confirm-delete"
              class="btn-ghost btn-sm btn"
              on:click|preventDefault={() => deleteAllChat()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width="16"
                height="16"
              >
                <path
                  class="fill-base-content"
                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm1.5 0a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm10.28-1.72-4.5 4.5a.75.75 0 0 1-1.06 0l-2-2a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018l1.47 1.47 3.97-3.97a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"
                />
              </svg>
            </button>
            <button
              name="cancel-delete"
              class="btn-ghost btn-sm btn"
              on:click|preventDefault={toggleDeleteAllConfirm}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width="16"
                height="16"
              >
                <path
                  class="fill-base-content"
                  d="M2.344 2.343h-.001a8 8 0 0 1 11.314 11.314A8.002 8.002 0 0 1 .234 10.089a8 8 0 0 1 2.11-7.746Zm1.06 10.253a6.5 6.5 0 1 0 9.108-9.275 6.5 6.5 0 0 0-9.108 9.275ZM6.03 4.97 8 6.94l1.97-1.97a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l1.97 1.97a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-1.97 1.97a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L6.94 8 4.97 6.03a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018Z"
                />
              </svg>
            </button>
          </div>
        </button>
      {:else}
        <button
          on:click|preventDefault={toggleDeleteAllConfirm}
          class="btn btn-ghost w-full flex justify-start items-center p-2.5 text-left text-sm capitalize"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="18"
            height="18"
            fill="currentColor"
            class="mr-3"
          >
            <path
              d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.75 1.75 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z"
            >
            </path>
          </svg>
          <span>Clear Chats</span>
        </button>
      {/if}
      <button
        on:click={toggleTheme}
        class="btn btn-ghost w-full flex justify-start items-center p-2.5 text-left text-sm capitalize"
      >
        <label class="swap swap-rotate">
          <input type="checkbox" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="18"
            height="18"
            fill="currentColor"
            class={`mr-3 ${theme == "dark" ? "swap-on" : "swap-off"}`}
          >
            <path
              d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-1.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm5.657-8.157a.75.75 0 0 1 0 1.061l-1.061 1.06a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.06-1.06a.75.75 0 0 1 1.06 0Zm-9.193 9.193a.75.75 0 0 1 0 1.06l-1.06 1.061a.75.75 0 1 1-1.061-1.06l1.06-1.061a.75.75 0 0 1 1.061 0ZM8 0a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V.75A.75.75 0 0 1 8 0ZM3 8a.75.75 0 0 1-.75.75H.75a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 3 8Zm13 0a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 16 8Zm-8 5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 13Zm3.536-1.464a.75.75 0 0 1 1.06 0l1.061 1.06a.75.75 0 0 1-1.06 1.061l-1.061-1.06a.75.75 0 0 1 0-1.061ZM2.343 2.343a.75.75 0 0 1 1.061 0l1.06 1.061a.751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018l-1.06-1.06a.75.75 0 0 1 0-1.06Z"
            >
            </path>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="18"
            height="18"
            fill="currentColor"
            class={`mr-3 ${theme == "dark" ? "swap-off" : "swap-on"}`}
          >
            <path
              d="M9.598 1.591a.749.749 0 0 1 .785-.175 7.001 7.001 0 1 1-8.967 8.967.75.75 0 0 1 .961-.96 5.5 5.5 0 0 0 7.046-7.046.75.75 0 0 1 .175-.786Zm1.616 1.945a7 7 0 0 1-7.678 7.678 5.499 5.499 0 1 0 7.678-7.678Z"
            >
            </path>
          </svg>
        </label>
        <span>{theme == "dark" ? "Light" : "Dark"} theme</span>
      </button>
    </div>
  </div>
</aside>

<div
  class={"relative h-full transition-all" + (bar_visible ? " md:ml-80" : "")}
>
  <slot />
</div>
