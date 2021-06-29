import { useState } from 'react'
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

const QuitButtons = (props) => {
    const [clicked, setClicked] = useState(false)
    const {player,pressResign} = props
    if(!clicked)
    {
        return(
            <>
                <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    size="large"
                    endIcon={<Icon>send</Icon>}
                    onClick={() => {
                        console.log("Pressed quit")
                        setClicked(true)
                    }}
                 >
                    Quit
                </Button>
            </>
        )
    }
    else
    {
        return(
            <>
                <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => {
                        setClicked(false)
                    }}
                >
                Cancel
                </Button>
                <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={() => {
                        setClicked(false)
                        pressResign(player)
                    }}
                >
                    Confirm
                </Button>
            </>
        )
    }
}

export default QuitButtons