import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { LargeSpinner as Loader } from '../basic/Loader';
import { ResponsiveContainer, AreaChart as Chart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import {
    getResolveTime,
    getResolveTimeError,
    getResolveTimeRequest,
    getResolveTimeSuccess
} from '../../actions/reports';

const noDataStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '150px'
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
        return (
            <div className="custom-tooltip">
                <h3>{label}</h3>
                <p className="label">{`${payload[0].name} : ${payload && payload[0] ? payload[0].value : 0} secs`}</p>
            </div>
        );
    }

    return null;
};

CustomTooltip.displayName = 'CustomTooltip';

CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.array,
    label: PropTypes.string
};

class ResolveTime extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resolveTime: []
        }
    }

    componentDidMount() {
        const { getResolveTime, currentProject, filter, startDate, endDate } = this.props;

        getResolveTime(currentProject, filter, startDate, endDate);
    }

    UNSAFE_componentWillReceiveProps(nextProps, prevState) {
        const {
            getResolveTime,
            currentProject,
            filter,
            startDate,
            endDate,
            resolveTimeReports
        } = nextProps;

        if (filter !== this.props.filter || startDate !== this.props.startDate || endDate !== this.props.endDate) {
            getResolveTime(currentProject, filter, startDate, endDate);
        }

        if (prevState.resolveTime !== resolveTimeReports.reports) {
            this.setState({
                resolveTime: nextProps.resolveTimeReports.reports
            });
        }
    }

    render() {
        const { resolveTime } = this.state;
        const { resolveTimeReports, filter } = this.props;

        if (resolveTime && resolveTime.length > 0) {
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <Chart data={resolveTime} margin={{ left: -15 }}>
                        <Legend verticalAlign="top" height={36} />
                        <XAxis dataKey={filter} />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Area type="linear" isAnimationActive={false} name="Average Resolve Time" dataKey="averageResolved" stroke="#000000" strokeWidth={1.5} fill="#e2e1f2" />
                    </Chart>
                </ResponsiveContainer>
            );
        } else {
            return (
                <div style={noDataStyle}>
                    {resolveTimeReports.requesting ? <Loader /> : <h3>NO AVG RESOLVE TIME</h3>}
                </div>
            );
        }
    }
}

ResolveTime.displayName = 'ResolveTime';

const actionCreators = {
    getResolveTime,
    getResolveTimeError,
    getResolveTimeRequest,
    getResolveTimeSuccess
}

const mapStateToProps = state => ({
    resolveTimeReports: state.report.averageTime
})

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(actionCreators, dispatch),
})

ResolveTime.propTypes = {
    getResolveTime: PropTypes.func,
    filter: PropTypes.string,
    startDate: PropTypes.object,
    endDate: PropTypes.object,
    currentProject: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    resolveTimeReports: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(ResolveTime);