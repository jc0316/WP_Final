import { useState } from 'react'
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

const QuitButtons = (props) => {
    const [clicked, setClicked] = useState(false)

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
                        props.pressResign()
                    }}
                >
                    Confirm
                </Button>
            </>
        )
    }
}

export default QuitButtons