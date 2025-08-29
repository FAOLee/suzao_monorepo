type TaggedRequest = {
  promise: Promise<Response>;
  abort: () => void;
  tag: string;
};

class RequestManager {
  private tagMap = new Map<string, AbortController[]>();

  requestWithTimeout(
    tag: string,
    url: string,
    options: RequestInit = {},
    timeout = 5000
  ): TaggedRequest {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    // 合并已有 signal
    if (options.signal) {
      const originalSignal = options.signal;
      if (originalSignal.aborted) {
        controller.abort();
      } else {
        originalSignal.addEventListener('abort', () => controller.abort());
      }
    }

    options.signal = controller.signal;

    // 注册 controller 到 tag
    if (!this.tagMap.has(tag)) {
      this.tagMap.set(tag, []);
    }
    this.tagMap.get(tag)!.push(controller);

    const promise = new Promise<Response>((resolve, reject) => {
      fetch(url, options)
        .then(resolve)
        .catch(error => {
          if (controller.signal.aborted) {
            reject(new Error('Request aborted'));
          } else {
            reject(error);
          }
        })
        .finally(() => {
          clearTimeout(timeoutId);
          // 请求完成后移除 controller
          const controllers = this.tagMap.get(tag);
          if (controllers) {
            this.tagMap.set(
              tag,
              controllers.filter(c => c !== controller)
            );
          }
        });
    });

    return {
      promise,
      abort: () => controller.abort(),
      tag
    };
  }

  cancelTag(tag: string) {
    const controllers = this.tagMap.get(tag);
    if (controllers) {
      controllers.forEach(controller => controller.abort());
      this.tagMap.delete(tag);
    }
  }

  cancelAll() {
    for (const tag of this.tagMap.keys()) {
      this.cancelTag(tag);
    }
  }
}

export { RequestManager, type TaggedRequest };
