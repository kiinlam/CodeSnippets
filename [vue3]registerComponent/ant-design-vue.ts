import {
  Button,
  Input
} from 'ant-design-vue';

import { App } from 'vue';

const compList = [Button, Input, Input.Search];

export function registerComponent(app: App) {
  compList.forEach((comp: any) => {
    console.log(comp.name || comp.displayName)
    app.component(comp.name || comp.displayName, comp);
  });
}
