# Production Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment

### Code Quality
- [ ] All tests passing (`npm test` in both frontend and backend)
- [ ] No console.log statements in production code (except intentional logging)
- [ ] Code reviewed and approved
- [ ] No TODO or FIXME comments for critical issues

### Environment Configuration
- [ ] `.env.example` files updated with all required variables
- [ ] Production environment variables configured on hosting platforms
- [ ] `REACT_APP_API_URL` points to production backend URL
- [ ] `FRONTEND_URL` in backend points to production frontend URL
- [ ] `NODE_ENV=production` set in backend

### Security
- [ ] All dependencies updated to latest stable versions
- [ ] No known security vulnerabilities (`npm audit`)
- [ ] Rate limiting configured and tested
- [ ] CORS configured with specific origin (not wildcard)
- [ ] Input validation on all endpoints
- [ ] HTTPS enforced on both frontend and backend
- [ ] Security headers configured (Helmet)
- [ ] No sensitive data in client-side code
- [ ] No API keys or secrets in Git repository

### Performance
- [ ] Frontend build optimized (`npm run build`)
- [ ] Compression enabled on backend
- [ ] Static assets cached properly
- [ ] Large dependencies reviewed and optimized
- [ ] Puppeteer configured for production environment

### Functionality
- [ ] URL input and validation working
- [ ] Static analysis (colors, fonts, spacing) working
- [ ] Animation extraction working
- [ ] Dynamic analysis (Puppeteer) working or gracefully disabled
- [ ] Token mapping interface functional
- [ ] Export and download working
- [ ] Error handling tested with various scenarios
- [ ] Progress indicators working correctly

## Deployment

### Backend Deployment
- [ ] Backend deployed to Railway/Render
- [ ] Health check endpoint responding (`/health`)
- [ ] Environment variables set correctly
- [ ] Logs accessible and readable
- [ ] No errors in startup logs

### Frontend Deployment
- [ ] Frontend deployed to Vercel
- [ ] Application loads without errors
- [ ] API connection working
- [ ] Environment variables set correctly
- [ ] Build logs show no warnings or errors

### Integration Testing
- [ ] Frontend can connect to backend
- [ ] CORS working correctly
- [ ] Full analysis flow works end-to-end
- [ ] Error messages display correctly
- [ ] Rate limiting works as expected

## Post-Deployment

### Monitoring
- [ ] Set up uptime monitoring (e.g., UptimeRobot, Pingdom)
- [ ] Configure error tracking (e.g., Sentry) - optional
- [ ] Set up log aggregation if needed
- [ ] Monitor resource usage on hosting platforms

### Documentation
- [ ] README.md updated with production URLs
- [ ] DEPLOYMENT.md reviewed and accurate
- [ ] API documentation up to date
- [ ] User guide available if needed

### Communication
- [ ] Stakeholders notified of deployment
- [ ] Production URLs shared with team
- [ ] Known limitations documented
- [ ] Support contact information provided

### Backup and Recovery
- [ ] Rollback procedure documented
- [ ] Previous deployment version noted
- [ ] Recovery time objective (RTO) defined
- [ ] Incident response plan in place

## Testing in Production

### Smoke Tests
- [ ] Homepage loads
- [ ] Health check returns 200 OK
- [ ] Can submit a URL for analysis
- [ ] Analysis completes successfully
- [ ] Can download starter kit
- [ ] Error handling works (test with invalid URL)

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### Performance Tests
- [ ] Page load time < 3 seconds
- [ ] Analysis completes in reasonable time
- [ ] No memory leaks during extended use
- [ ] Rate limiting doesn't affect normal usage

## Maintenance

### Regular Tasks
- [ ] Weekly: Check logs for errors
- [ ] Weekly: Monitor resource usage
- [ ] Monthly: Update dependencies
- [ ] Monthly: Review and rotate secrets if needed
- [ ] Quarterly: Security audit
- [ ] Quarterly: Performance review

### Incident Response
- [ ] On-call rotation defined (if applicable)
- [ ] Escalation path documented
- [ ] Incident log template ready
- [ ] Post-mortem process defined

## Sign-Off

- [ ] Technical lead approval
- [ ] QA approval
- [ ] Product owner approval
- [ ] Deployment date and time scheduled
- [ ] Rollback plan reviewed and approved

---

**Deployment Date**: _______________

**Deployed By**: _______________

**Approved By**: _______________

**Production URLs**:
- Frontend: _______________
- Backend: _______________

**Notes**:
_______________________________________________
_______________________________________________
_______________________________________________
