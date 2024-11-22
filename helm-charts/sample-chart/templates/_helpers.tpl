{{/*
Define a default fully qualified app name.
*/}}
{{- define "sample-chart.fullname" -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
