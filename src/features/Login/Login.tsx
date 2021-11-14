import * as React from 'react'
import {useFormik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from '../../bll/store';
import {loginTC} from '../../bll/auth-reducer';
import {Redirect} from 'react-router';
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    TextField
} from "@material-ui/core";

type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}

export const Login = () => {
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

    const dispatch = useDispatch()

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validate: (values) => {
            const errors: FormikErrorType = {};
            if (!values.email) {
                errors.email = 'Required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }
            if (values.password.length < 3) {
                errors.password = 'Pole to be 3 symbol';
            }
            return errors;
        },
        onSubmit: values => {
            dispatch(loginTC(values))
            formik.resetForm()
        },
    })
    if (isLoggedIn) {
        return <Redirect to={'/'}/>
    }
    return <Grid container justifyContent="center">
        <Grid item xs={4}>
            <FormLabel>
                <p>Test account credentials:</p>
                <p>Email: shuminskiy.nik@mail.ru</p>
                <p>Password: free</p>
            </FormLabel>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormGroup>
                        <TextField
                            label="Email"
                            margin="normal"
                            {...formik.getFieldProps("email")}
                        />
                        {formik.errors.email ? <div> {formik.errors.email}</div> : null}
                        <TextField
                            label="Password"
                            margin="normal"
                            {...formik.getFieldProps("password")}

                        />
                        {
                            formik.touched.email &&
                            formik.errors.password ? <div> {formik.errors.password}</div> : null
                        }
                        <FormControlLabel
                            label={'Remember me'}
                            control={<Checkbox
                                checked={formik.values.rememberMe}
                                {...formik.getFieldProps("rememberMe")}
                            />}
                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'}>Login</Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}
