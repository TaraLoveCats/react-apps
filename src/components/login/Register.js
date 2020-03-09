import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Button, Form, Checkbox } from 'antd';
import PropTypes from 'prop-types';
import { phonePattern, USER_REGISTER, CHECK_IF_EXISTED } from '../../util/app'

function Register({ form: { getFieldDecorator, validateFields, getFieldValue } }) {
    // const initialRef = useRef(true); //代表初始值
    const dispatch = useDispatch();
    const alreadyExisted = useSelector(state => state.alreadyExisted)

    const handleRegister = (e) => {
        e.preventDefault();
        validateFields((err, fieldsValue) => {
            if (!err) {
                if (alreadyExisted) { 
                    return; 
                }
                const {concent, ...values} = fieldsValue;
                // if (!concent) {
                //     initialRef.current = false;
                //     return;
                // }
                dispatch({type: USER_REGISTER, payload: values })
            }
        })
    }

    const checkPhone = ({ target }) => {
        const phone = target.value.trim()
        if (phonePattern.test(phone)) {
            dispatch({ type: CHECK_IF_EXISTED, payload: phone })
        } 
    }
    return (
        <Form onSubmit={handleRegister}>
            <Form.Item>
                {getFieldDecorator('phone', {
                    rules: [
                        { required: true, message: '请输入正确的手机号' },
                        { pattern: phonePattern, message: '该手机号码不正确，请重新输入'}
                    ],
                })(
                    <Input 
                        placeholder="请输入注册手机号" 
                        onChange={(e) =>checkPhone(e)}
                    />
                )}
                {alreadyExisted && phonePattern.test(getFieldValue('phone')) &&
                    <div style={{lineHeight: 1, color: '#f5222d', marginBottom: '-15px'}}>该手机号已被注册</div>
                }
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('username', {
                    rules: [{ required: true, message: '请输入昵称' }],
                })(
                    <Input placeholder="请输入昵称" />
                )}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('password', {
                    rules: [
                        { required: true, message: '请输入密码' },
                        { min: 4, message: '密码最少4位' } 
                    ],
                })(
                    <Input.Password placeholder="请输入密码" />
                )}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('concent', {
                    valuePropName: 'checked',
                    initialValue: false,
                    rules: [
                        { 
                            message: '注册请同意协议', 
                            validator: (rule, value, cb) => (value === true ? cb() : cb(true)) 
                        }
                    ]
                })(
                    <Checkbox 
                        // onChange={() => initialRef.current = false}
                    >
                        同意
                        <a href="" onClick={(e) => e.preventDefault()}>用户协议</a>和
                        <a href="" onClick={(e) => e.preventDefault()}>隐私政策</a>
                    </Checkbox>
                )}
                {/* 自己实现的校验，不用validator*/}
                {/* {!initialRef.current && !getFieldValue('concent') &&
                    <Alert message="注册请同意协议" type="error" />
                } */}
            </Form.Item>
            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: '100%', background: '#42c02e', borderColor: '#42c02e' }}
                >
                    注册
            </Button>
            </Form.Item>
        </Form>
    )
}

Register.propTypes = {
    form: PropTypes.object.isRequired,
}
const RegisterWithForm = Form.create({ name: 'register_form' })(Register);
export default RegisterWithForm;