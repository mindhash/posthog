# Generated by Django 3.0.3 on 2020-02-27 08:04

from django.db import migrations, models, transaction
import django.db.models.deletion


class Migration(migrations.Migration):
    atomic = False
    dependencies = [
        ("posthog", "0025_cohort"),
    ]

    operations = [
        migrations.CreateModel(
            name="ElementGroup",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID",),),
                ("hash", models.CharField(blank=True, max_length=400, null=True, unique=True),),
            ],
        ),
        migrations.AddField(
            model_name="event", name="elements_hash", field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name="element",
            name="event",
            field=models.ForeignKey(
                blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to="posthog.Event",
            ),
        ),
        migrations.AddIndex(
            model_name="event", index=models.Index(fields=["elements_hash"], name="posthog_eve_element_48becd_idx"),
        ),
        migrations.AddField(
            model_name="elementgroup",
            name="team",
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="posthog.Team"),
        ),
        migrations.AddField(
            model_name="element",
            name="group",
            field=models.ForeignKey(
                blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to="posthog.ElementGroup",
            ),
        ),
    ]
