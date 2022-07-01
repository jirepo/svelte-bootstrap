<script lang="ts">
import NaonCard from './component/NaonCard.svelte';
import NaonBaseButton from './component/NaonBaseButton.svelte';

import { Button, ButtonGroup } from 'sveltestrap';



</script>

<div class="main">
    <div >
        <ButtonGroup>
            <Button active>Alpha</Button>
            <Button>Bravo</Button>
            <Button>Charlie</Button>
          </ButtonGroup>        

    </div>
    <div>
        <NaonCard card />
    </div>
    <div>
        <NaonBaseButton/>
    </div>
</div>

<style>
    .main { 
        display: flex; 
    }

</style>
