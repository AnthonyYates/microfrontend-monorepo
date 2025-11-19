import { Button as SharedButton } from 'ui'

export default function Button() {
    return <SharedButton onClick={() => alert('Hello from Remote Button')}>Remote Button</SharedButton>
}
