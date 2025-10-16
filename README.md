# Cortex UI Kit

It's on the first phase. Here is a simple guide on how to use UI kit:

## Chat

### React

#### Installation

```sh
npm install @cortex-ai/ui-kit
```

#### Usage

```tsx
import { useCortexUIKit } from "@cortex-ai/ui-kit"
import { CortexChat } from "@cortex-ai/ui-kit/chat"

export default function App() {
  const { control } = useCortexUIKit({
    api: {
      async getClientSecret() {
        // this will be actual fetch request to generate a client secret and then return it once we implement client secret support
        // for now just return the Cortex API key (not safe, dangeroes)
        return "xxx"
      }
    }
  })

  return (
    <div>
      <CortexChat control={control} agentId="work_xxx" theme="fuchsia" />
    </div>
  )
}
```

#### Options

The `CortexChat` component accepts the following options:

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `agentId` | `string` | Yes | - | The agent ID to use for the chat |
| `theme` | `object` | No | - | Theme customization options |
| `theme.colorScheme` | `"light" \| "dark"` | No | `"light"` | Color scheme for the chat interface |
| `theme.accentColor` | `"blue" \| "indigo" \| "violet" \| "purple" \| "fuchsia" \| "pink" \| "rose" \| "sky" \| "cyan" \| "teal" \| "gray" \| "stone"` | No | `"blue"` | Primary accent color for the chat interface |
| `theme.neutralColor` | `"gray" \| "zinc" \| "stone"` | No | `"zinc"` | Neutral color scheme for secondary UI elements |
| `startScreen` | `object` | No | - | Start screen configuration |
| `startScreen.greeting` | `string` | No | - | Initial greeting message shown when the chat starts |
| `startScreen.suggestedMessages` | `SuggestedMessage[]` | No | - | Array of suggested messages to display as quick action buttons |
| `composer` | `object` | No | - | Composer configuration |
| `composer.placeholder` | `string` | No | `"Type a message..."` | Custom placeholder text for the message input |

**SuggestedMessage Type:**
```tsx
{
  label: string;    // The display label for the suggested message button
  prompt: string;   // The actual prompt/message to send when the button is clicked
}
```

### Vanilla

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <div>
    <cortex-chat id="my-chat"></cortex-chat>
  </div>

  <!-- Load UI kit -->
  <script src="https://unpkg.com/@cortex-ai/ui-kit@latest/dist/index.js"></script>

  <!-- Set options -->
  <script>
    const myChat = document.getElementById("my-chat");
    myChat.setOptions({
      agentId: "work_xxx",
      api: {
        async getClientSecret() {
          return "xxx"
        }
      },
      theme: "fuchsia"
    });
  </script>
</body>
</html>
```
